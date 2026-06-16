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
[Route("api/products/{productId}/rate")]
[Authorize]
public class RatingController : ControllerBase
{
    private readonly AppDbContext _context;

    public RatingController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// POST /api/products/{productId}/rate
    /// Submit or update a star rating (1-5) for a product.
    /// One rating per user per product — re-rating replaces the old value.
    /// Recalculates Product.Rating (average) and Product.ReviewCount after each submission.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> RateProduct(string productId, [FromBody] SubmitRatingDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        // Verify the product exists
        var product = await _context.Products
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync(p => p.Id == productId);

        if (product == null)
            return NotFound(new { message = $"Product '{productId}' not found." });

        // Upsert: find existing review by this user for this product
        var existingReview = await _context.ProductReviews
            .FirstOrDefaultAsync(r => r.ProductId == productId && r.UserId == userId);

        if (existingReview != null)
        {
            // Update existing rating
            existingReview.Rating = dto.Rating;
            existingReview.CreatedAt = DateTime.UtcNow;
            _context.ProductReviews.Update(existingReview);
        }
        else
        {
            // Create new rating
            var newReview = new ProductReview
            {
                Id = Guid.NewGuid().ToString(),
                ProductId = productId,
                UserId = userId,
                Rating = dto.Rating,
                CreatedAt = DateTime.UtcNow
            };
            await _context.ProductReviews.AddAsync(newReview);
        }

        await _context.SaveChangesAsync();

        // Recalculate average rating from all reviews for this product
        var allRatings = await _context.ProductReviews
            .Where(r => r.ProductId == productId)
            .Select(r => r.Rating)
            .ToListAsync();

        var newAverage = allRatings.Count > 0
            ? Math.Round(allRatings.Average(), 1)
            : 0.0;

        // Update product with new average and count
        product.Rating = newAverage;
        product.ReviewCount = allRatings.Count;
        product.UpdatedAt = DateTime.UtcNow;
        _context.Products.Update(product);
        await _context.SaveChangesAsync();

        return Ok(new RatingResponseDto
        {
            ProductId = productId,
            NewAverageRating = newAverage,
            NewReviewCount = allRatings.Count,
            UserRating = dto.Rating
        });
    }

    /// <summary>
    /// GET /api/products/{productId}/rate
    /// Returns the current user's rating for this product (if any).
    /// Used to pre-fill the star widget on page load.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetMyRating(string productId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var review = await _context.ProductReviews
            .FirstOrDefaultAsync(r => r.ProductId == productId && r.UserId == userId);

        return Ok(new { userRating = review?.Rating ?? 0 });
    }
}
