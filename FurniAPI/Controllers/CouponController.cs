using FurniAPI.Data;
using FurniAPI.DTOs;
using FurniAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FurniAPI.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")] 
    [Authorize(Roles = "Admin")]
    public class CouponController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public CouponController(ApplicationDbContext db)
        {
            _db = db;
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CouponReadDto>>> GetCoupons()
        {
            var coupons = await _db.Coupons.Select(c => MapToReadDto(c)).ToListAsync();
            return Ok(coupons);
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<CouponReadDto>> GetCoupon(int id)
        {
            var coupon = await _db.Coupons.FindAsync(id);
            if (coupon == null)
                return NotFound();

            return Ok(MapToReadDto(coupon));
        }

        
        [HttpPost]
        public async Task<ActionResult<CouponReadDto>> CreateCoupon(CouponWriteDto dto)
        {
            bool codeExists = await _db.Coupons.AnyAsync(c => c.Code == dto.Code);
            if (codeExists)
                return BadRequest("This coupon code already exists.");

            var coupon = new Coupon
            {
                Code = dto.Code,
                DiscountPercent = dto.DiscountPercent,
                IsActive = dto.IsActive,
                ExpiryDate = dto.ExpiryDate
            };

            _db.Coupons.Add(coupon);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCoupon), new { id = coupon.Id }, MapToReadDto(coupon));
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCoupon(int id, CouponWriteDto dto)
        {
            var coupon = await _db.Coupons.FindAsync(id);
            if (coupon == null)
                return NotFound();

            bool codeExists = await _db.Coupons.AnyAsync(c => c.Code == dto.Code && c.Id != id);
            if (codeExists)
                return BadRequest("This coupon code already exists.");

            coupon.Code = dto.Code;
            coupon.DiscountPercent = dto.DiscountPercent;
            coupon.IsActive = dto.IsActive;
            coupon.ExpiryDate = dto.ExpiryDate;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCoupon(int id)
        {
            var coupon = await _db.Coupons.FindAsync(id);
            if (coupon == null)
                return NotFound();

            _db.Coupons.Remove(coupon);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        private static CouponReadDto MapToReadDto(Coupon c) => new()
        {
            Id = c.Id,
            Code = c.Code,
            DiscountPercent = c.DiscountPercent,
            IsActive = c.IsActive,
            ExpiryDate = c.ExpiryDate
        };
    }
}
