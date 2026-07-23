using System.ComponentModel.DataAnnotations;

namespace FurniAPI.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public double Price { get; set; }

        public string? ImageUrl { get; set; }

        [Required]
        public string Category { get; set; }

        [Required]
        public int Stock { get; set; } = 0;
    }
}
