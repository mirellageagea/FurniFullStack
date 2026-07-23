using FurniAPI.Data;
using FurniAPI.DTOs;
using FurniAPI.Models;
using FurniAPI.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace FurniAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _db;
        private readonly IEmailSender _emailSender;
        private readonly IHttpClientFactory _httpClientFactory;

        public AuthController(UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager, IConfiguration config,
            ApplicationDbContext db, IEmailSender emailSender, IHttpClientFactory httpClientFactory)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _config = config;
            _db = db;
            _emailSender = emailSender;
            _httpClientFactory = httpClientFactory;
        }

        
        [HttpPost("send-verification-code")]
        public async Task<IActionResult> SendVerificationCode(SendVerificationCodeDto dto)
        {
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return BadRequest("An account with this email already exists.");

            
            var oldCodes = _db.EmailVerificationCodes.Where(c => c.Email == dto.Email && !c.Used);
            _db.EmailVerificationCodes.RemoveRange(oldCodes);

            var code = RandomNumberGenerator.GetInt32(100000, 1000000).ToString(); 

            _db.EmailVerificationCodes.Add(new EmailVerificationCode
            {
                Email = dto.Email,
                Code = code,
                ExpiresAt = DateTime.UtcNow.AddMinutes(10)
            });
            await _db.SaveChangesAsync();

            await _emailSender.SendAsync(
                dto.Email,
                "Your Furni verification code",
                $"<p>Your verification code is:</p><h2 style=\"letter-spacing:4px\">{code}</h2><p>This code expires in 10 minutes.</p>"
            );

            return Ok(new { message = "Verification code sent. Check your email." });
        }

        
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
        {
            var existing = await _userManager.FindByEmailAsync(dto.Email);
            if (existing != null)
                return BadRequest("An account with this email already exists.");

            var codeRecord = await _db.EmailVerificationCodes
                .Where(c => c.Email == dto.Email && !c.Used)
                .OrderByDescending(c => c.CreatedAt)
                .FirstOrDefaultAsync();

            if (codeRecord == null || codeRecord.Code != dto.Code)
                return BadRequest("Invalid verification code.");

            if (codeRecord.ExpiresAt < DateTime.UtcNow)
                return BadRequest("This verification code has expired. Please request a new one.");

            var user = new IdentityUser { UserName = dto.Email, Email = dto.Email, EmailConfirmed = true };
            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors.Select(e => e.Description));

            codeRecord.Used = true;
            await _db.SaveChangesAsync();

            if (!await _roleManager.RoleExistsAsync("User"))
                await _roleManager.CreateAsync(new IdentityRole("User"));

            await _userManager.AddToRoleAsync(user, "User");

            return await BuildAuthResponse(user);
        }

       
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return Unauthorized("Invalid email or password.");

            var passwordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!passwordValid)
                return Unauthorized("Invalid email or password.");

            return await BuildAuthResponse(user);
        }

        
        [HttpPost("google")]
        public async Task<ActionResult<AuthResponseDto>> GoogleLogin(GoogleLoginDto dto)
        {
            var googleClientId = _config["Google:ClientId"];
            if (string.IsNullOrWhiteSpace(googleClientId) || googleClientId.Contains("YOUR_"))
                return BadRequest("Google sign-in isn't configured on the server yet (Google:ClientId in appsettings.json).");

            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync($"https://oauth2.googleapis.com/tokeninfo?id_token={Uri.EscapeDataString(dto.IdToken)}");

            if (!response.IsSuccessStatusCode)
                return Unauthorized("Invalid Google token.");

            var json = await response.Content.ReadAsStringAsync();
            using var payload = JsonDocument.Parse(json);
            var root = payload.RootElement;

            var audience = root.GetProperty("aud").GetString();
            if (audience != googleClientId)
                return Unauthorized("This Google token was not issued for this app.");

            var email = root.GetProperty("email").GetString();
            var emailVerified = root.TryGetProperty("email_verified", out var ev) && ev.GetString() == "true";

            if (string.IsNullOrEmpty(email) || !emailVerified)
                return Unauthorized("Google account email is not verified.");

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                
                user = new IdentityUser { UserName = email, Email = email, EmailConfirmed = true };
                var randomPassword = Convert.ToBase64String(RandomNumberGenerator.GetBytes(18)) + "Aa1!";
                var result = await _userManager.CreateAsync(user, randomPassword);

                if (!result.Succeeded)
                    return BadRequest(result.Errors.Select(e => e.Description));

                if (!await _roleManager.RoleExistsAsync("User"))
                    await _roleManager.CreateAsync(new IdentityRole("User"));

                await _userManager.AddToRoleAsync(user, "User");
            }

            return await BuildAuthResponse(user);
        }

        private async Task<AuthResponseDto> BuildAuthResponse(IdentityUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
            };
            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

            var jwtSettings = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiresInMinutes"] ?? "120"));

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new AuthResponseDto
            {
                UserId = user.Id,
                Email = user.Email ?? string.Empty,
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                ExpiresAt = expires,
                Roles = roles.ToList()
            };
        }
    }
}
