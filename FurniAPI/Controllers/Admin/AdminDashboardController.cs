using FurniAPI.Data;
using FurniAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FurniAPI.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/dashboard")] 
    [Authorize(Roles = "Admin")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<IdentityUser> _userManager;

        public AdminDashboardController(ApplicationDbContext db, UserManager<IdentityUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        
        [HttpGet]
        public async Task<ActionResult<DashboardStatsDto>> GetStats()
        {
            var completedItems = await _db.Carts
                .Include(c => c.Product)
                .Where(c => c.StatusId == 2)
                .ToListAsync();

            int totalOrders = completedItems
                .GroupBy(c => new { c.UserId, c.CompletedAt?.Date })
                .Count();

            int totalUsers = await _userManager.Users.CountAsync();

            double totalRevenue = completedItems.Sum(c => c.Product!.Price * c.Quantity);
            double totalDiscount = completedItems
                .GroupBy(c => c.CompletedAt)
                .Sum(g => g.FirstOrDefault()?.DiscountAmount ?? 0);
            double finalRevenue = Math.Round(totalRevenue - totalDiscount, 2);

            int totalProducts = await _db.Products.CountAsync();
            int totalCoupons = await _db.Coupons.CountAsync();

            var dailySummary = completedItems
                .Where(c => c.CompletedAt >= DateTime.Now.AddDays(-7))
                .GroupBy(c => c.CompletedAt!.Value.Date)
                .Select(g => new DailySummaryDto
                {
                    Date = g.Key,
                    Orders = g.Select(x => new { x.UserId, x.CompletedAt }).Distinct().Count(),
                    Revenue = Math.Round(
                        g.Sum(x => x.Product!.Price * x.Quantity) - (g.FirstOrDefault()?.DiscountAmount ?? 0), 2)
                })
                .OrderByDescending(x => x.Date)
                .ToList();

            return Ok(new DashboardStatsDto
            {
                TotalOrders = totalOrders,
                TotalUsers = totalUsers,
                TotalRevenue = finalRevenue,
                TotalProducts = totalProducts,
                TotalCoupons = totalCoupons,
                DailySummary = dailySummary
            });
        }
    }
}
