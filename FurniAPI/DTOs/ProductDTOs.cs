using System.ComponentModel.DataAnnotations;

namespace FurniAPI.DTOs
{
    public class ProductReadDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double Price { get; set; }
        public string? ImageUrl { get; set; }
        public string Category { get; set; } = string.Empty;
        public int Stock { get; set; }
    }

    
    public class ProductWriteDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public double Price { get; set; }

        [Required]
        public string Category { get; set; } = string.Empty;

        [Required]
        public int Stock { get; set; }

        public IFormFile? ImageFile { get; set; }
    }
}
