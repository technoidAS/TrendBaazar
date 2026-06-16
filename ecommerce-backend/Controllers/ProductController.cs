using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ecommerce_backend.Data;
using ecommerce_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ecommerce_backend.Controllers;

[ApiController]
[Route("api/products")]
public class ProductController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts(
        [FromQuery] string? category = null,
        [FromQuery] string? search = null,
        [FromQuery] string? brand = null,
        [FromQuery] double? minRating = null,
        [FromQuery] double? minPrice = null,
        [FromQuery] double? maxPrice = null,
        [FromQuery] string? sortBy = null) // e.g. "price_asc", "price_desc", "rating"
    {
        var query = _context.Products.AsQueryable();

        // 1. Category Filter (Case Insensitive)
        if (!string.IsNullOrEmpty(category))
        {
            var categoryLower = category.ToLower();
            query = query.Where(p => p.Category.ToLower() == categoryLower);
        }

        // 2. Search Text
        if (!string.IsNullOrEmpty(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(searchLower) || 
                                     p.Description.ToLower().Contains(searchLower) ||
                                     p.Brand.ToLower().Contains(searchLower) ||
                                     p.Category.ToLower().Contains(searchLower));
        }

        // 3. Brand Filter
        if (!string.IsNullOrEmpty(brand))
        {
            var brandLower = brand.ToLower();
            query = query.Where(p => p.Brand.ToLower() == brandLower);
        }

        // 4. Rating Filter
        if (minRating.HasValue)
        {
            query = query.Where(p => p.Rating >= minRating.Value);
        }

        // 5. Price Filters — use decimal to match Product.Price decimal column
        if (minPrice.HasValue)
        {
            query = query.Where(p => p.Price >= (decimal)minPrice.Value);
        }
        if (maxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= (decimal)maxPrice.Value);
        }

        // 6. Sorting
        if (!string.IsNullOrEmpty(sortBy))
        {
            query = sortBy.ToLower() switch
            {
                "price_asc" => query.OrderBy(p => p.Price),
                "price_desc" => query.OrderByDescending(p => p.Price),
                "rating" => query.OrderByDescending(p => p.Rating),
                "reviews" => query.OrderByDescending(p => p.ReviewCount),
                _ => query
            };
        }

        var products = await query.ToListAsync();
        return Ok(products);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeaturedProducts()
    {
        var products = await _context.Products.Where(p => p.Featured).ToListAsync();
        return Ok(products);
    }

    [HttpGet("brands")]
    public async Task<IActionResult> GetBrands()
    {
        var brands = await _context.Products
            .Select(p => p.Brand)
            .Distinct()
            .OrderBy(b => b)
            .ToListAsync();
            
        return Ok(brands);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(string id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { message = $"Product with ID '{id}' was not found." });
        }
        return Ok(product);
    }
}
