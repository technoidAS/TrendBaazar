using System;
using System.Text.Json.Serialization;

namespace ecommerce_backend.Models;

public class OrderItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string OrderId { get; set; } = null!;
    public string ProductId { get; set; } = null!;
    public string Name { get; set; } = null!;
    public decimal Price { get; set; }    // decimal for financial accuracy
    public string Image { get; set; } = null!;
    public string Category { get; set; } = null!;
    public int Quantity { get; set; }

    // Configurations
    public string SelectedColor { get; set; } = "";
    public string SelectedSize { get; set; } = "";

    // Navigation — JsonIgnore prevents circular serialization loops
    [JsonIgnore]
    public Order Order { get; set; } = null!;

    [JsonIgnore]
    public Product? Product { get; set; } = null;
}

