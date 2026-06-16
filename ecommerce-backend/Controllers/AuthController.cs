using System;
using System.Security.Claims;
using System.Threading.Tasks;
using ecommerce_backend.Data;
using ecommerce_backend.DTOs;
using ecommerce_backend.Models;
using ecommerce_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ecommerce_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly OtpService _otpService;
    private readonly TokenService _tokenService;

    public AuthController(AppDbContext context, OtpService otpService, TokenService tokenService)
    {
        _context = context;
        _otpService = otpService;
        _tokenService = tokenService;
    }

    [HttpPost("otp-request")]
    public IActionResult RequestOtp([FromBody] OtpRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var code = _otpService.GenerateOtp(request.Phone);
        
        // Log the generated OTP code to the backend console (standard terminal output)
        Console.WriteLine("\n==================================================");
        Console.WriteLine($"[SMS GATEWAY SIMULATOR] Dispatched OTP code '{code}' to phone '{request.Phone}'");
        Console.WriteLine("==================================================\n");
        
        // Return a clean response without exposing the OTP code in the JSON payload
        return Ok(new { message = "OTP sent successfully. Please check your backend terminal console for the verification code." });
    }

    [HttpPost("otp-verify")]
    public async Task<IActionResult> VerifyOtp([FromBody] OtpVerifyDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var isValid = _otpService.VerifyOtp(request.Phone, request.Code);
        if (!isValid)
        {
            return BadRequest(new { message = "Invalid OTP code. Please check your backend console/logs for the correct code that was printed when you requested the OTP." });
        }

        // Find or create User, including their addresses
        var user = await _context.Users
            .Include(u => u.Addresses)
            .FirstOrDefaultAsync(u => u.Phone == request.Phone);
            
        if (user == null)
        {
            user = new User
            {
                Phone = request.Phone,
                Name = $"User {request.Phone[^4..]}", // default name using last 4 digits
                Role = request.Phone == "9999999999" ? "admin" : "customer" // Automatically make 9999999999 admin
            };
            
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            
            // Reload user with empty addresses loaded to avoid null references
            user.Addresses = new List<AddressBook>();
        }

        var token = _tokenService.GenerateToken(user);

        var userProfile = new UserProfileDto
        {
            Id = user.Id,
            Phone = user.Phone,
            Name = user.Name,
            Email = user.Email,
            Avatar = user.Avatar,
            Role = user.Role,
            Addresses = user.Addresses.Select(a => new AddressDto
            {
                Id = a.Id,
                Name = a.Name,
                Phone = a.Phone,
                Address = a.Address
            }).ToList()
        };

        return Ok(new AuthResponseDto
        {
            Token = token,
            User = userProfile
        });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users
            .Include(u => u.Addresses)
            .FirstOrDefaultAsync(u => u.Id == userId);
            
        if (user == null)
        {
            return NotFound(new { message = "User profile not found." });
        }

        return Ok(new UserProfileDto
        {
            Id = user.Id,
            Phone = user.Phone,
            Name = user.Name,
            Email = user.Email,
            Avatar = user.Avatar,
            Role = user.Role,
            Addresses = user.Addresses.Select(a => new AddressDto
            {
                Id = a.Id,
                Name = a.Name,
                Phone = a.Phone,
                Address = a.Address
            }).ToList()
        });
    }
}
