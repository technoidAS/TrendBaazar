using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using ecommerce_backend.Data;
using ecommerce_backend.DTOs;
using ecommerce_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ecommerce_backend.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrderController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        // Start local EF transaction to guarantee consistency
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                Status = "Processing",
                ShippingName = request.ShippingName,
                ShippingPhone = request.ShippingPhone,
                ShippingAddress = request.ShippingAddress,
                Subtotal = request.Subtotal,
                Discount = request.Discount,
                Shipping = request.Shipping,
                Tax = request.Tax,
                Total = request.Total,
                PromoCodeApplied = request.PromoCodeApplied,
                PaymentMethod = request.PaymentMethod,
                PaymentId = request.PaymentId,
                Signature = request.Signature
            };

            foreach (var itemDto in request.Items)
            {
                var product = await _context.Products.FindAsync(itemDto.ProductId);
                if (product == null)
                {
                    return BadRequest(new { message = $"Product '{itemDto.Name}' (ID: {itemDto.ProductId}) not found." });
                }

                // Check stock
                if (product.Stock < itemDto.Quantity)
                {
                    return BadRequest(new { message = $"Insufficient stock for product '{product.Name}'. Available: {product.Stock}, Requested: {itemDto.Quantity}" });
                }

                // Deduct stock
                product.Stock -= itemDto.Quantity;

                var orderItem = new OrderItem
                {
                    ProductId = itemDto.ProductId,
                    Name = itemDto.Name,
                    Price = itemDto.Price,
                    Image = itemDto.Image,
                    Category = itemDto.Category,
                    Quantity = itemDto.Quantity,
                    SelectedColor = itemDto.SelectedColor,
                    SelectedSize = itemDto.SelectedSize
                };

                order.Items.Add(orderItem);
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            var responseDto = MapToOrderDetailsDto(order);
            return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, responseDto);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, new { message = "An error occurred while processing your order.", details = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var orders = await _context.Orders
            .Include(o => o.Items)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        var orderDtos = orders.Select(MapToOrderDetailsDto).ToList();
        return Ok(orderDtos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderById(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var order = await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound(new { message = $"Order with ID '{id}' was not found." });
        }

        // Validate user authorization: must be owner or admin
        if (order.UserId != userId && userRole != "admin")
        {
            return Forbid();
        }

        return Ok(MapToOrderDetailsDto(order));
    }

    private static OrderDetailsDto MapToOrderDetailsDto(Order order)
    {
        return new OrderDetailsDto
        {
            Id = order.Id,
            UserId = order.UserId,
            OrderDate = order.OrderDate,
            Status = order.Status,
            ShippingName = order.ShippingName,
            ShippingPhone = order.ShippingPhone,
            ShippingAddress = order.ShippingAddress,
            Subtotal = order.Subtotal,
            Discount = order.Discount,
            Shipping = order.Shipping,
            Tax = order.Tax,
            Total = order.Total,
            PromoCodeApplied = order.PromoCodeApplied,
            PaymentMethod = order.PaymentMethod,
            PaymentId = order.PaymentId,
            Signature = order.Signature,
            Items = order.Items.Select(i => new OrderItemDto
            {
                Id = i.Id,
                ProductId = i.ProductId,
                Name = i.Name,
                Price = i.Price,
                Image = i.Image,
                Category = i.Category,
                Quantity = i.Quantity,
                SelectedColor = i.SelectedColor,
                SelectedSize = i.SelectedSize
            }).ToList()
        };
    }
}
