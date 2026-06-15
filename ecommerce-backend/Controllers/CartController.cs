using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using ecommerce_backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ecommerce_backend.Controllers;

[ApiController]
[Route("api/cart")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly AppDbContext _context;

    public CartController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// GET /api/cart
    /// Returns the current user's saved cart items from the database.
    /// Called on login to restore the user's cart across devices/sessions.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound(new { message = "User not found." });

        // Return the raw JSON array string as parsed JSON (not a double-encoded string)
        try
        {
            var cartArray = JsonSerializer.Deserialize<object>(
                string.IsNullOrEmpty(user.CartJson) ? "[]" : user.CartJson
            );
            return Ok(cartArray);
        }
        catch
        {
            return Ok(new object[] {}); // Fallback to empty if cart JSON is malformed
        }
    }

    /// <summary>
    /// PUT /api/cart
    /// Saves/replaces the entire cart for the current user in the database.
    /// Called every time the cart changes (add, remove, update quantity).
    /// Body: JSON array of cart items
    /// </summary>
    [HttpPut]
    public async Task<IActionResult> SaveCart([FromBody] JsonElement cartItems)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound(new { message = "User not found." });

        // Validate the incoming body is a JSON array
        if (cartItems.ValueKind != JsonValueKind.Array)
        {
            return BadRequest(new { message = "Cart must be a JSON array of cart items." });
        }

        // Serialize back to string for storage in DB column
        user.CartJson = cartItems.GetRawText();

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Cart saved successfully.", itemCount = cartItems.GetArrayLength() });
    }

    /// <summary>
    /// DELETE /api/cart
    /// Clears the user's cart in the database (called after order is placed).
    /// </summary>
    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound(new { message = "User not found." });

        user.CartJson = "[]";

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Cart cleared successfully." });
    }
}
