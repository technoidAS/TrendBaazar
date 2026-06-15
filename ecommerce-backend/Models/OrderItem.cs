using System;
using System.Text.Json.Serialization;

namespace ecommerce_backend.Models;

public class OrderItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string OrderId { get; set; } = null!;
    public string ProductId { get; set; } = null!;
    public string Name { get; set; } = null!;
    public double Price { get; set; }
    public string Image { get; set; } = null!;
    public string Category { get; set; } = null!;
    public int Quantity { get; set; }
    
    // Configurations
    public string SelectedColor { get; set; } = "";
    public string SelectedSize { get; set; } = "";

    // Navigation
    [JsonIgnore]
    public Order Order { get; set; } = null!;
}
