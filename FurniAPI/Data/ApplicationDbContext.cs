using FurniAPI.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FurniAPI.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartStatus> CartStatuses { get; set; }
        public DbSet<Coupon> Coupons { get; set; }
        public DbSet<EmailVerificationCode> EmailVerificationCodes { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<CartStatus>().HasData(
                new CartStatus { Id = 1, Name = "Pending" },
                new CartStatus { Id = 2, Name = "Complete" }
            );
        }
    }
}
