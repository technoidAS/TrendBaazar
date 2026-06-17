using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ecommerce_backend.Data;
using ecommerce_backend.DTOs;
using ecommerce_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ecommerce_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    // --- 1. Dashboard Stats ---
    [HttpGet("stats")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var activeOrders = await _context.Orders
            .Where(o => o.Status != OrderStatus.Cancelled)
            .ToListAsync();

        var totalSales = activeOrders.Sum(o => o.Total);
        var ordersCount = await _context.Orders.CountAsync();
        var usersCount = await _context.Users.CountAsync();
        var productsCount = await _context.Products.CountAsync();

        // Revenue & Count by category
        var orderItems = await _context.OrderItems
            .Include(oi => oi.Order)
            .Where(oi => oi.Order.Status != OrderStatus.Cancelled)
            .ToListAsync();

        var categorySales = orderItems
            .GroupBy(oi => oi.Category.ToLower())
            .ToDictionary(
                g => g.Key,
                g => g.Sum(oi => oi.Price * oi.Quantity)
            );

        var dbProducts = await _context.Products.Include(p => p.Category).ToListAsync();
        var categoryProductCounts = dbProducts
            .GroupBy(p => p.CategoryName.ToLower())
            .ToDictionary(
                g => g.Key,
                g => g.Count()
            );

        var latestOrders = await _context.Orders
            .OrderByDescending(o => o.OrderDate)
            .Take(10)
            .Select(o => new
            {
                o.Id,
                o.ShippingName,
                o.Total,
                o.Status,
                o.OrderDate
            })
            .ToListAsync();

        var stats = new
        {
            TotalSales = totalSales,
            OrdersCount = ordersCount,
            UsersCount = usersCount,
            ProductsCount = productsCount,
            CategorySales = categorySales,
            CategoryProductCounts = categoryProductCounts,
            LatestOrders = latestOrders
        };

        return Ok(stats);
    }

    // --- 2. Order Management ---

    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        return Ok(orders);
    }

    [HttpPut("orders/{id}")]
    public async Task<IActionResult> UpdateOrderStatus(string id, [FromBody] OrderStatusUpdateDto request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var order = await _context.Orders.FindAsync(id);
        if (order == null)
        {
            return NotFound(new { message = $"Order with ID '{id}' was not found." });
        }

        // OrderStatus is an enum — model binding already validates it; no manual string check needed
        order.Status = request.Status;
        _context.Orders.Update(order);
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Order status updated to '{request.Status}' successfully.", orderId = order.Id, status = order.Status.ToString() });
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _context.Users
            .Include(u => u.Addresses)
            .OrderBy(u => u.Name)
            .ToListAsync();

        var userDtos = users.Select(u => new UserProfileDto
        {
            Id = u.Id,
            Phone = u.Phone,
            Name = u.Name,
            Email = u.Email,
            Avatar = u.Avatar,
            Role = u.Role,
            Addresses = u.Addresses.Select(a => new AddressDto
            {
                Id = a.Id,
                Name = a.Name,
                Phone = a.Phone,
                Address = a.Address
            }).ToList()
        }).ToList();

        return Ok(userDtos);
    }

    // --- 3. Product CRUD ---

    [HttpGet("products")]
    public async Task<IActionResult> GetAllProducts()
    {
        var products = await _context.Products.Include(p => p.Category).OrderBy(p => p.Name).ToListAsync();
        return Ok(products);
    }

    [HttpPost("products")]
    public async Task<IActionResult> CreateProduct([FromBody] ProductInputDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var categoryName = dto.Category.Trim().ToLower();
        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Name == categoryName);
        if (category == null)
        {
            category = new Category { Name = categoryName };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
        }

        var productId = string.IsNullOrEmpty(dto.Id) ? Guid.NewGuid().ToString() : dto.Id;
        if (!string.IsNullOrEmpty(dto.Id))
        {
            var exists = await _context.Products.AnyAsync(p => p.Id == dto.Id);
            if (exists)
            {
                return BadRequest(new { message = $"Product with ID '{dto.Id}' already exists." });
            }
        }

        var product = new Product
        {
            Id = productId,
            Name = dto.Name,
            Price = dto.Price,
            CategoryId = category.Id,
            Brand = dto.Brand,
            Image = dto.Image,
            Images = dto.Images,
            Rating = dto.Rating,
            ReviewCount = dto.ReviewCount,
            Description = dto.Description,
            Features = dto.Features,
            Sizes = dto.Sizes,
            Colors = dto.Colors,
            Stock = dto.Stock,
            Featured = dto.Featured,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        product.Category = category;

        return CreatedAtAction(nameof(GetProductByIdFromCatalog), new { id = product.Id }, product);
    }

    [HttpPut("products/{id}")]
    public async Task<IActionResult> UpdateProduct(string id, [FromBody] ProductInputDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var product = await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
        if (product == null)
        {
            return NotFound(new { message = $"Product with ID '{id}' not found." });
        }

        var categoryName = dto.Category.Trim().ToLower();
        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Name == categoryName);
        if (category == null)
        {
            category = new Category { Name = categoryName };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
        }

        product.Name = dto.Name;
        product.Price = dto.Price;
        product.CategoryId = category.Id;
        product.Brand = dto.Brand;
        product.Image = dto.Image;
        product.Images = dto.Images;
        product.Rating = dto.Rating;
        product.ReviewCount = dto.ReviewCount;
        product.Description = dto.Description;
        product.Features = dto.Features;
        product.Sizes = dto.Sizes;
        product.Colors = dto.Colors;
        product.Stock = dto.Stock;
        product.Featured = dto.Featured;
        product.UpdatedAt = DateTime.UtcNow;

        _context.Products.Update(product);
        await _context.SaveChangesAsync();

        product.Category = category;

        return Ok(product);
    }

    [HttpDelete("products/{id}")]
    public async Task<IActionResult> DeleteProduct(string id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { message = $"Product with ID '{id}' not found." });
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Product with ID '{id}' has been deleted." });
    }

    // Internal helper endpoint for CreatedAtAction redirection
    [HttpGet("products/{id}")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task<IActionResult> GetProductByIdFromCatalog(string id)
    {
        var product = await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
        if (product == null) return NotFound();
        return Ok(product);
    }
}
