using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using ecommerce_backend.Models;

namespace ecommerce_backend.DTOs;

public class OrderItemInputDto
{
    [Required]
    public string ProductId { get; set; } = null!;

    [Required]
    public string Name { get; set; } = null!;

    [Required]
    public decimal Price { get; set; }

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
    public decimal Subtotal { get; set; }

    public decimal Discount { get; set; }
    public decimal Shipping { get; set; }
    public decimal Tax { get; set; }

    [Required]
    public decimal Total { get; set; }

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
    public decimal Price { get; set; }
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
    public string Status { get; set; } = null!;  // Serialized as string for frontend

    public string ShippingName { get; set; } = null!;
    public string ShippingPhone { get; set; } = null!;
    public string ShippingAddress { get; set; } = null!;

    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public decimal Shipping { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }

    public string PromoCodeApplied { get; set; } = "";
    public string PaymentMethod { get; set; } = "";
    public string PaymentId { get; set; } = "";
    public string Signature { get; set; } = "";

    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderStatusUpdateDto
{
    [Required]
    public OrderStatus Status { get; set; }  // Strongly typed — prevents typos
}

