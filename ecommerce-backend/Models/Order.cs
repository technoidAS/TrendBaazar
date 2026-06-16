using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ecommerce_backend.Models;

public class Order
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string UserId { get; set; } = null!;
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Strongly-typed status — prevents typos like "Procesing", "shipped"
    public OrderStatus Status { get; set; } = OrderStatus.Processing;

    // Shipping Details (flat snapshot to avoid relational deletion issues)
    public string ShippingName { get; set; } = null!;
    public string ShippingPhone { get; set; } = null!;
    public string ShippingAddress { get; set; } = null!;

    // Totals — decimal for financial accuracy (double causes 0.1+0.2 != 0.3)
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public decimal Shipping { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }

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

