using FurniAPI.Data;
using FurniAPI.DTOs;
using FurniAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FurniAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
    [Authorize] 
    public class CartController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public CartController(ApplicationDbContext db)
        {
            _db = db;
        }

        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        
        [HttpGet]
        public async Task<ActionResult<CartSummaryDto>> GetCart()
        {
            var items = await GetPendingCartItems();
            return Ok(BuildSummary(items));
        }

        
        [HttpPost("add/{productId}")]
        public async Task<ActionResult<CartSummaryDto>> AddToCart(int productId)
        {
            string userId = GetUserId();

            var product = await _db.Products.FindAsync(productId);
            if (product == null)
                return NotFound("Product not found.");

            if (product.Stock <= 0)
                return BadRequest("Sorry, this product is out of stock.");

            var existing = await _db.Carts.FirstOrDefaultAsync(c =>
                c.UserId == userId && c.ProductId == productId && c.StatusId == 1);

            if (existing != null)
            {
                if (existing.Quantity >= product.Stock)
                    return BadRequest($"Sorry, only {product.Stock} items available in stock.");

                existing.Quantity++;
            }
            else
            {
                _db.Carts.Add(new Cart
                {
                    UserId = userId,
                    ProductId = productId,
                    Quantity = 1,
                    StatusId = 1,
                    CreatedAt = DateTime.Now
                });
            }

            await _db.SaveChangesAsync();

            var items = await GetPendingCartItems();
            return Ok(BuildSummary(items));
        }

        
        [HttpPut("{id}/increase")]
        public async Task<ActionResult<CartSummaryDto>> Increase(int id)
        {
            string userId = GetUserId();
            var item = await _db.Carts.Include(c => c.Product)
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (item == null)
                return NotFound();

            if (item.Quantity >= item.Product!.Stock)
                return BadRequest($"Sorry, only {item.Product.Stock} items available in stock.");

            item.Quantity++;
            await _db.SaveChangesAsync();

            var items = await GetPendingCartItems();
            return Ok(BuildSummary(items));
        }

        
        [HttpPut("{id}/decrease")]
        public async Task<ActionResult<CartSummaryDto>> Decrease(int id)
        {
            string userId = GetUserId();
            var item = await _db.Carts.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (item == null)
                return NotFound();

            if (item.Quantity > 1)
                item.Quantity--;
            else
                _db.Carts.Remove(item);

            await _db.SaveChangesAsync();

            var items = await GetPendingCartItems();
            return Ok(BuildSummary(items));
        }

        
        [HttpDelete("{id}")]
        public async Task<ActionResult<CartSummaryDto>> RemoveItem(int id)
        {
            string userId = GetUserId();
            var item = await _db.Carts.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (item != null)
            {
                _db.Carts.Remove(item);
                await _db.SaveChangesAsync();
            }

            var items = await GetPendingCartItems();
            return Ok(BuildSummary(items));
        }

        
        [HttpPost("validate-coupon")]
        public async Task<ActionResult<CouponValidationResultDto>> ValidateCoupon(ValidateCouponDto dto)
        {
            var items = await GetPendingCartItems();
            double total = Math.Round(items.Sum(c => c.Product!.Price * c.Quantity), 2);

            var coupon = await _db.Coupons.FirstOrDefaultAsync(c =>
                c.Code == dto.CouponCode && c.IsActive && c.ExpiryDate >= DateTime.Now);

            if (coupon == null)
            {
                return Ok(new CouponValidationResultDto
                {
                    Valid = false,
                    Discount = 0,
                    FinalTotal = total,
                    OriginalTotal = total,
                    Message = "Invalid or expired coupon code."
                });
            }

            double discount = Math.Round(total * coupon.DiscountPercent / 100, 2);
            double finalTotal = Math.Round(total - discount, 2);

            return Ok(new CouponValidationResultDto
            {
                Valid = true,
                Discount = discount,
                FinalTotal = finalTotal,
                OriginalTotal = total,
                Message = $"Coupon '{dto.CouponCode}' applied! You save ${discount}"
            });
        }

        
        [HttpPost("place-order")]
        public async Task<ActionResult<OrderReadDto>> PlaceOrder(PlaceOrderDto dto)
        {
            string userId = GetUserId();

            var cartItems = await GetPendingCartItems();
            if (!cartItems.Any())
                return BadRequest("Your cart is empty.");

            double total = Math.Round(cartItems.Sum(c => c.Product!.Price * c.Quantity), 2);
            double discount = 0;
            string? appliedCoupon = null;

            if (!string.IsNullOrEmpty(dto.CouponCode))
            {
                var coupon = await _db.Coupons.FirstOrDefaultAsync(c =>
                    c.Code == dto.CouponCode && c.IsActive && c.ExpiryDate >= DateTime.Now);

                if (coupon != null)
                {
                    discount = Math.Round(total * coupon.DiscountPercent / 100, 2);
                    appliedCoupon = dto.CouponCode;
                }
            }

            double finalTotal = Math.Round(total - discount, 2);
            var completedAt = DateTime.Now;

            foreach (var item in cartItems)
            {
                item.StatusId = 2;
                item.CompletedAt = completedAt;
                item.FirstName = dto.FirstName;
                item.LastName = dto.LastName;
                item.Address = dto.Address;
                item.Email = dto.Email;
                item.Phone = dto.Phone;
                item.Country = dto.Country;
                item.CouponCode = appliedCoupon;
                item.DiscountAmount = discount;

                item.Product!.Stock -= item.Quantity;
            }

            await _db.SaveChangesAsync();

            return Ok(new OrderReadDto
            {
                CompletedAt = completedAt.ToString("o"),
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                CouponCode = appliedCoupon,
                SubTotal = total,
                Discount = discount,
                Total = finalTotal,
                Items = cartItems.Select(MapItem).ToList()
            });
        }

        
        [HttpGet("orders")]
        public async Task<ActionResult<IEnumerable<OrderReadDto>>> GetMyOrders()
        {
            string userId = GetUserId();

            var completed = await _db.Carts
                .Include(c => c.Product)
                .Where(c => c.UserId == userId && c.StatusId == 2)
                .ToListAsync();

            var orders = completed
                .GroupBy(c => c.CompletedAt)
                .Select(g => new OrderReadDto
                {
                    CompletedAt = g.Key!.Value.ToString("o"),
                    FirstName = g.First().FirstName,
                    LastName = g.First().LastName,
                    Email = g.First().Email,
                    CouponCode = g.First().CouponCode,
                    SubTotal = Math.Round(g.Sum(x => x.Product!.Price * x.Quantity), 2),
                    Discount = g.First().DiscountAmount ?? 0,
                    Total = Math.Round(g.Sum(x => x.Product!.Price * x.Quantity) - (g.First().DiscountAmount ?? 0), 2),
                    Items = g.Select(MapItem).ToList()
                })
                .OrderByDescending(o => o.CompletedAt)
                .ToList();

            return Ok(orders);
        }

        private async Task<List<Cart>> GetPendingCartItems()
        {
            string userId = GetUserId();
            return await _db.Carts
                .Include(c => c.Product)
                .Where(c => c.UserId == userId && c.StatusId == 1)
                .ToListAsync();
        }

        private static CartSummaryDto BuildSummary(List<Cart> items) => new()
        {
            Items = items.Select(MapItem).ToList(),
            Total = Math.Round(items.Sum(c => c.Product!.Price * c.Quantity), 2)
        };

        private static CartItemReadDto MapItem(Cart c) => new()
        {
            Id = c.Id,
            ProductId = c.ProductId,
            ProductName = c.Product?.Name ?? string.Empty,
            ProductImageUrl = c.Product?.ImageUrl,
            ProductPrice = c.Product?.Price ?? 0,
            ProductStock = c.Product?.Stock ?? 0,
            Quantity = c.Quantity
        };
    }
}
