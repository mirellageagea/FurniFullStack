using System.ComponentModel.DataAnnotations;

namespace FurniAPI.DTOs
{
    public class CouponReadDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public double DiscountPercent { get; set; }
        public bool IsActive { get; set; }
        public DateTime ExpiryDate { get; set; }
    }

    public class CouponWriteDto
    {
        [Required]
        public string Code { get; set; } = string.Empty;

        [Required]
        public double DiscountPercent { get; set; }

        public bool IsActive { get; set; } = true;

        [Required]
        public DateTime ExpiryDate { get; set; }
    }
}
