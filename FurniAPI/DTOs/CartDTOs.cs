using System.ComponentModel.DataAnnotations;

namespace FurniAPI.DTOs
{
    public class CartItemReadDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string? ProductImageUrl { get; set; }
        public double ProductPrice { get; set; }
        public int ProductStock { get; set; }
        public int Quantity { get; set; }
        public double Subtotal => ProductPrice * Quantity;
    }

    public class CartSummaryDto
    {
        public List<CartItemReadDto> Items { get; set; } = new();
        public double Total { get; set; }
    }

    
    public class ValidateCouponDto
    {
        [Required]
        public string CouponCode { get; set; } = string.Empty;
    }

    public class CouponValidationResultDto
    {
        public bool Valid { get; set; }
        public double Discount { get; set; }
        public double FinalTotal { get; set; }
        public double OriginalTotal { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class PlaceOrderDto
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        public string Address { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Phone { get; set; } = string.Empty;

        public string? Country { get; set; }
        public string? CouponCode { get; set; }
        public string? OrderNotes { get; set; }
    }

    public class OrderReadDto
    {
        public string CompletedAt { get; set; } = string.Empty; 
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? CouponCode { get; set; }
        public double SubTotal { get; set; }
        public double Discount { get; set; }
        public double Total { get; set; }
        public List<CartItemReadDto> Items { get; set; } = new();
    }
}
