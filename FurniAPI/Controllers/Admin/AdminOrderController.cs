using FurniAPI.Data;
using FurniAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FurniAPI.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/orders")] 
    [Authorize(Roles = "Admin")]
    public class AdminOrderController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public AdminOrderController(ApplicationDbContext db)
        {
            _db = db;
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderReadDto>>> GetAllOrders()
        {
            var cartItems = await _db.Carts
                .Include(c => c.Product)
                .Where(c => c.StatusId == 2)
                .ToListAsync();

            var orders = cartItems
                .GroupBy(c => new { c.UserId, c.CompletedAt, c.FirstName, c.LastName, c.Email, c.CouponCode })
                .Select(g => new OrderReadDto
                {
                    CompletedAt = g.Key.CompletedAt!.Value.ToString("o"),
                    FirstName = g.Key.FirstName,
                    LastName = g.Key.LastName,
                    Email = g.Key.Email,
                    CouponCode = g.Key.CouponCode,
                    SubTotal = Math.Round(g.Sum(x => x.Product!.Price * x.Quantity), 2),
                    Discount = g.FirstOrDefault()?.DiscountAmount ?? 0,
                    Total = Math.Round(g.Sum(x => x.Product!.Price * x.Quantity) - (g.FirstOrDefault()?.DiscountAmount ?? 0), 2),
                    Items = g.Select(x => new CartItemReadDto
                    {
                        Id = x.Id,
                        ProductId = x.ProductId,
                        ProductName = x.Product?.Name ?? string.Empty,
                        ProductImageUrl = x.Product?.ImageUrl,
                        ProductPrice = x.Product?.Price ?? 0,
                        ProductStock = x.Product?.Stock ?? 0,
                        Quantity = x.Quantity
                    }).ToList()
                })
                .OrderByDescending(x => x.CompletedAt)
                .ToList();

            return Ok(orders);
        }
    }
}
