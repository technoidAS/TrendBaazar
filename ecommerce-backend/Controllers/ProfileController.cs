using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using ecommerce_backend.Data;
using ecommerce_backend.DTOs;
using ecommerce_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ecommerce_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProfileController(AppDbContext context)
    {
        _context = context;
    }

    // --- Profile Editing ---

    [HttpPut]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var user = await _context.Users
            .Include(u => u.Addresses)
            .FirstOrDefaultAsync(u => u.Id == userId);
            
        if (user == null) return NotFound(new { message = "User not found." });

        if (!string.IsNullOrEmpty(request.Name)) user.Name = request.Name;
        if (!string.IsNullOrEmpty(request.Email)) user.Email = request.Email;
        if (!string.IsNullOrEmpty(request.Avatar)) user.Avatar = request.Avatar;
        if (!string.IsNullOrEmpty(request.Address)) user.Address = request.Address;

        // If client passes address list inside profile updates (like Checkout.jsx does), sync them
        if (request.Addresses != null)
        {
            // Clear current list
            _context.AddressBooks.RemoveRange(user.Addresses);
            
            // Re-add them
            foreach (var addr in request.Addresses)
            {
                var newAddr = new AddressBook
                {
                    UserId = userId,
                    Name = addr.Name,
                    Phone = addr.Phone,
                    Address = addr.Address
                };
                _context.AddressBooks.Add(newAddr);
            }
        }

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        // Reload addresses to return in DTO
        var updatedAddresses = await _context.AddressBooks
            .Where(a => a.UserId == userId)
            .ToListAsync();

        return Ok(new UserProfileDto
        {
            Id = user.Id,
            Phone = user.Phone,
            Name = user.Name,
            Email = user.Email,
            Avatar = user.Avatar,
            Role = user.Role,
            Address = user.Address,
            Addresses = updatedAddresses.Select(a => new AddressDto
            {
                Id = a.Id,
                Name = a.Name,
                Phone = a.Phone,
                Address = a.Address
            }).ToList()
        });
    }

    // --- Address Book CRUD ---

    [HttpGet("addresses")]
    public async Task<IActionResult> GetAddresses()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var addresses = await _context.AddressBooks
            .Where(a => a.UserId == userId)
            .Select(a => new AddressDto
            {
                Id = a.Id,
                Name = a.Name,
                Phone = a.Phone,
                Address = a.Address
            })
            .ToListAsync();

        return Ok(addresses);
    }

    [HttpPost("addresses")]
    public async Task<IActionResult> AddAddress([FromBody] CreateAddressDto request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound(new { message = "User not found." });

        var addressBook = new AddressBook
        {
            UserId = userId,
            Name = request.Name,
            Phone = request.Phone,
            Address = request.Address
        };

        _context.AddressBooks.Add(addressBook);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAddresses), new { id = addressBook.Id }, new AddressDto
        {
            Id = addressBook.Id,
            Name = addressBook.Name,
            Phone = addressBook.Phone,
            Address = addressBook.Address
        });
    }

    [HttpPut("addresses/{id}")]
    public async Task<IActionResult> UpdateAddress(string id, [FromBody] CreateAddressDto request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var address = await _context.AddressBooks
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (address == null) return NotFound(new { message = "Address not found." });

        address.Name = request.Name;
        address.Phone = request.Phone;
        address.Address = request.Address;

        _context.AddressBooks.Update(address);
        await _context.SaveChangesAsync();

        return Ok(new AddressDto
        {
            Id = address.Id,
            Name = address.Name,
            Phone = address.Phone,
            Address = address.Address
        });
    }

    [HttpDelete("addresses/{id}")]
    public async Task<IActionResult> DeleteAddress(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var address = await _context.AddressBooks
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (address == null) return NotFound(new { message = "Address not found or unauthorized access." });

        _context.AddressBooks.Remove(address);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Address deleted successfully." });
    }
}
