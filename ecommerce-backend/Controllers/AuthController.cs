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
    public async Task<IActionResult> RequestOtp([FromBody] OtpRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var phone = request.Phone.Trim();
        var userExists = await _context.Users.AnyAsync(u => u.Phone == phone);
        if (!userExists)
        {
            return Ok(new AuthFlowResponseDto
            {
                Message = "No account found for this phone number. Please sign up first.",
                NextStep = "signup",
                UserExists = false
            });
        }

        var code = _otpService.GenerateOtp(phone);
        
        // Log the generated OTP code to the backend console (standard terminal output)
        Console.WriteLine("\n==================================================");
        Console.WriteLine($"[SMS GATEWAY SIMULATOR] Dispatched OTP code '{code}' to phone '{phone}'");
        Console.WriteLine("==================================================\n");
        
        return Ok(new AuthFlowResponseDto
        {
            Message = "OTP sent successfully. Please check your backend terminal console for the verification code.",
            NextStep = "verify",
            UserExists = true
        });
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] SignupRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var phone = request.Phone.Trim();
        var existingUser = await _context.Users.AnyAsync(u => u.Phone == phone);
        if (existingUser)
        {
            return Conflict(new { message = "An account already exists for this phone number. Please log in instead." });
        }

        var user = new User
        {
            Phone = phone,
            Name = request.Name.Trim(),
            Email = request.Email?.Trim() ?? string.Empty,
            Avatar = request.Avatar?.Trim() ?? string.Empty,
            Address = request.Address?.Trim() ?? string.Empty,
            Role = phone == "9999999999" ? "admin" : "customer"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new AuthFlowResponseDto
        {
            Message = "Account created successfully. Request OTP to continue.",
            NextStep = "otp-request",
            UserExists = true
        });
    }

    [HttpPost("otp-verify")]
    public async Task<IActionResult> VerifyOtp([FromBody] OtpVerifyDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var phone = request.Phone.Trim();

        var user = await _context.Users
            .Include(u => u.Addresses)
            .FirstOrDefaultAsync(u => u.Phone == phone);

        if (user == null)
        {
            return NotFound(new { message = "No account found for this phone number. Please sign up first." });
        }

        var isValid = _otpService.VerifyOtp(phone, request.Code);
        if (!isValid)
        {
            return BadRequest(new { message = "Invalid OTP code. Please check your backend console/logs for the correct code that was printed when you requested the OTP." });
        }

        var token = _tokenService.GenerateToken(user);

        var userProfile = new UserProfileDto
        {
            Id = user.Id,
            Phone = user.Phone,
            Name = user.Name,
            Email = user.Email,
            Avatar = user.Avatar,
            Address = user.Address,
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
            Address = user.Address,
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
