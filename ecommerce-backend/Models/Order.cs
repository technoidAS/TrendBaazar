using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ecommerce_backend.Models;

public class Order
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string UserId { get; set; } = null!;
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Processing"; // "Processing" | "Shipped" | "Delivered" | "Cancelled"
    
    // Shipping Details (Flat snapshot of shipping address book fields to avoid relational deletion bugs)
    public string ShippingName { get; set; } = null!;
    public string ShippingPhone { get; set; } = null!;
    public string ShippingAddress { get; set; } = null!;
    
    // Totals
    public double Subtotal { get; set; }
    public double Discount { get; set; }
    public double Shipping { get; set; }
    public double Tax { get; set; }
    public double Total { get; set; }
    
    // Promo
    public string PromoCodeApplied { get; set; } = "";
    
    // Payment logs
    public string PaymentMethod { get; set; } = "Razorpay Sandbox";
    public string PaymentId { get; set; } = "";
    public string Signature { get; set; } = "";
    
    // Navigation
    [JsonIgnore]
    public User User { get; set; } = null!;
    public List<OrderItem> Items { get; set; } = new();
}
