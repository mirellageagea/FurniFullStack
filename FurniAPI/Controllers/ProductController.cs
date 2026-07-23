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
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ProductController(ApplicationDbContext db, IWebHostEnvironment webHostEnvironment)
        {
            _db = db;
            _webHostEnvironment = webHostEnvironment;
        }

        
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ProductReadDto>>> GetProducts([FromQuery] string? category)
        {
            var query = _db.Products.AsQueryable();

            if (!string.IsNullOrEmpty(category))
                query = query.Where(p => p.Category == category);

            var products = await query.Select(p => MapToReadDto(p)).ToListAsync();
            return Ok(products);
        }

        
        [HttpGet("featured")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ProductReadDto>>> GetFeatured()
        {
            var products = await _db.Products.Take(3).Select(p => MapToReadDto(p)).ToListAsync();
            return Ok(products);
        }

        
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ProductReadDto>> GetProduct(int id)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            return Ok(MapToReadDto(product));
        }

        
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<ProductReadDto>> CreateProduct([FromForm] ProductWriteDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Category = dto.Category,
                Stock = dto.Stock
            };

            if (dto.ImageFile != null)
                product.ImageUrl = await SaveImage(dto.ImageFile);

            _db.Products.Add(product);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, MapToReadDto(product));
        }

        
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductWriteDto dto)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.Category = dto.Category;
            product.Stock = dto.Stock;

            if (dto.ImageFile != null)
            {
                DeleteImageIfExists(product.ImageUrl);
                product.ImageUrl = await SaveImage(dto.ImageFile);
            }

            await _db.SaveChangesAsync();
            return NoContent();
        }

        
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            DeleteImageIfExists(product.ImageUrl);

            _db.Products.Remove(product);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        private async Task<string> SaveImage(IFormFile imageFile)
        {
            string wwwRootPath = _webHostEnvironment.WebRootPath;
            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
            string productPath = Path.Combine(wwwRootPath, "images", "products");

            if (!Directory.Exists(productPath))
                Directory.CreateDirectory(productPath);

            using (var fileStream = new FileStream(Path.Combine(productPath, fileName), FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }

            return "/images/products/" + fileName;
        }

        private void DeleteImageIfExists(string? imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl))
                return;

            string wwwRootPath = _webHostEnvironment.WebRootPath;
            string oldImagePath = Path.Combine(wwwRootPath, imageUrl.TrimStart('/'));
            if (System.IO.File.Exists(oldImagePath))
                System.IO.File.Delete(oldImagePath);
        }

        private static ProductReadDto MapToReadDto(Product p) => new()
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            ImageUrl = p.ImageUrl,
            Category = p.Category,
            Stock = p.Stock
        };
    }
}
