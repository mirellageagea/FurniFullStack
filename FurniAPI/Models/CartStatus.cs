using System.ComponentModel.DataAnnotations;

namespace FurniAPI.Models
{
    public class CartStatus
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
    }
}
