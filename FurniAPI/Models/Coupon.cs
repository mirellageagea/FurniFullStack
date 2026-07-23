using System.ComponentModel.DataAnnotations;

namespace FurniAPI.Models
{
    public class Coupon
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Code { get; set; }

        [Required]
        public double DiscountPercent { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime ExpiryDate { get; set; }
    }
}
