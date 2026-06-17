using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ecommerce_backend.DTOs;

public class ProductInputDto
{
    public string? Id { get; set; }
    
    [Required]
    public string Name { get; set; } = null!;
    
    [Required]
    public decimal Price { get; set; }
    
    [Required]
    public string Category { get; set; } = null!; // The category name, e.g. "apparel"
    
    [Required]
    public string Brand { get; set; } = null!;
    
    [Required]
    public string Image { get; set; } = null!;
    
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
