using System;
using System.Collections.Generic;

namespace ecommerce_backend.Models;

public class Product
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = null!;
    public double Price { get; set; }
    public string Category { get; set; } = null!;
    public string Brand { get; set; } = null!;
    public string Image { get; set; } = null!;
    
    // Store arrays as lists, EF Core can map them to text[] or JSON columns in PostgreSQL
    public List<string> Images { get; set; } = new();
    public double Rating { get; set; } = 5.0;
    public int ReviewCount { get; set; }
    public string Description { get; set; } = "";
    
    public List<string> Features { get; set; } = new();
    public List<string> Sizes { get; set; } = new();
    public List<string> Colors { get; set; } = new();
    
    public int Stock { get; set; }
    public bool Featured { get; set; }
}
