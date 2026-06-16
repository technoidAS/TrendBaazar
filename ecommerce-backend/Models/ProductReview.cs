using System;
using System.Text.Json.Serialization;

namespace ecommerce_backend.Models;

/// <summary>
/// Records a single user's rating (1–5 stars) for a product.
/// Unique constraint: one rating per user per product (upsert on re-rate).
/// </summary>
public class ProductReview
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public string ProductId { get; set; } = null!;

    public string UserId { get; set; } = null!;

    /// <summary>Star rating 1–5</summary>
    public int Rating { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties (excluded from JSON to avoid circular serialization)
    [JsonIgnore]
    public Product Product { get; set; } = null!;

    [JsonIgnore]
    public User User { get; set; } = null!;
}
