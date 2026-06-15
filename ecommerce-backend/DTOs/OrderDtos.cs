using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ecommerce_backend.DTOs;

public class OrderItemInputDto
{
    [Required]
    public string ProductId { get; set; } = null!;

    [Required]
    public string Name { get; set; } = null!;

    [Required]
    public double Price { get; set; }

    [Required]
    public string Image { get; set; } = null!;

    [Required]
    public string Category { get; set; } = null!;

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    public int Quantity { get; set; }

    public string SelectedColor { get; set; } = "";
    public string SelectedSize { get; set; } = "";
}

public class PlaceOrderDto
{
    [Required]
    public string ShippingName { get; set; } = null!;

    [Required]
    [Phone]
    public string ShippingPhone { get; set; } = null!;

    [Required]
    public string ShippingAddress { get; set; } = null!;

    [Required]
    public double Subtotal { get; set; }

    public double Discount { get; set; }
    public double Shipping { get; set; }
    public double Tax { get; set; }

    [Required]
    public double Total { get; set; }

    public string PromoCodeApplied { get; set; } = "";

    public string PaymentMethod { get; set; } = "Razorpay Sandbox";
    public string PaymentId { get; set; } = "";
    public string Signature { get; set; } = "";

    [Required]
    [MinLength(1, ErrorMessage = "Order must contain at least one item")]
    public List<OrderItemInputDto> Items { get; set; } = new();
}

public class OrderItemDto
{
    public string Id { get; set; } = null!;
    public string ProductId { get; set; } = null!;
    public string Name { get; set; } = null!;
    public double Price { get; set; }
    public string Image { get; set; } = null!;
    public string Category { get; set; } = null!;
    public int Quantity { get; set; }
    public string SelectedColor { get; set; } = "";
    public string SelectedSize { get; set; } = "";
}

public class OrderDetailsDto
{
    public string Id { get; set; } = null!;
    public string UserId { get; set; } = null!;
    public DateTime OrderDate { get; set; }
    public string Status { get; set; } = null!;
    
    public string ShippingName { get; set; } = null!;
    public string ShippingPhone { get; set; } = null!;
    public string ShippingAddress { get; set; } = null!;
    
    public double Subtotal { get; set; }
    public double Discount { get; set; }
    public double Shipping { get; set; }
    public double Tax { get; set; }
    public double Total { get; set; }
    
    public string PromoCodeApplied { get; set; } = "";
    public string PaymentMethod { get; set; } = "";
    public string PaymentId { get; set; } = "";
    public string Signature { get; set; } = "";
    
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderStatusUpdateDto
{
    [Required]
    public string Status { get; set; } = null!; // "Processing" | "Shipped" | "Delivered" | "Cancelled"
}
