using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FurniAPI.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")] 
    public class SetupController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public SetupController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        
        [HttpPost("assign-admin-role")]
        public async Task<IActionResult> CreateAdminRole([FromQuery] string email)
        {
            if (!await _roleManager.RoleExistsAsync("Admin"))
                await _roleManager.CreateAsync(new IdentityRole("Admin"));

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return NotFound($"No user found with email {email}. Register that account first.");

            if (!await _userManager.IsInRoleAsync(user, "Admin"))
            {
                await _userManager.AddToRoleAsync(user, "Admin");
                return Ok($"Admin role created and assigned to {email}!");
            }

            return Ok($"{email} is already an Admin.");
        }
    }
}
