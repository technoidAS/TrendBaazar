using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ecommerce_backend.Models;

public class Product
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = null!;
    public decimal Price { get; set; }       // decimal (not double) for financial accuracy
    public string Category { get; set; } = null!;
    public string Brand { get; set; } = null!;
    public string Image { get; set; } = null!;

    // Store arrays as JSON string columns in SQL Server
    public List<string> Images { get; set; } = new();
    public double Rating { get; set; } = 5.0; // Average rating (double is fine for avg calculation)
    public int ReviewCount { get; set; }
    public string Description { get; set; } = "";

    public List<string> Features { get; set; } = new();
    public List<string> Sizes { get; set; } = new();
    public List<string> Colors { get; set; } = new();

    public int Stock { get; set; }
    public bool Featured { get; set; }

    // Audit timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation — excluded from JSON to avoid circular serialization
    [JsonIgnore]
    public List<ProductReview> Reviews { get; set; } = new();
}

