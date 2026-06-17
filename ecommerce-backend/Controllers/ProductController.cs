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
        [FromQuery] string? sortBy = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12)
    {
        var query = _context.Products.AsQueryable();

        // 1. Category Filter (Case Insensitive)
        if (!string.IsNullOrEmpty(category))
        {
            var categoryLower = category.ToLower();
            query = query.Where(p => p.Category.Name.ToLower() == categoryLower);
        }

        // 2. Search Text
        if (!string.IsNullOrEmpty(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(searchLower) || 
                                     p.Description.ToLower().Contains(searchLower) ||
                                     p.Brand.ToLower().Contains(searchLower) ||
                                     p.Category.Name.ToLower().Contains(searchLower));
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

        // 5. Price Filters
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
                _ => query.OrderBy(p => p.Id)
            };
        }
        else
        {
            query = query.OrderBy(p => p.Id);
        }

        var totalCount = await query.CountAsync();

        // Apply Include for category navigation
        query = query.Include(p => p.Category);

        // Apply Pagination
        var skip = (page - 1) * pageSize;
        var products = await query.Skip(skip).Take(pageSize).ToListAsync();

        var hasMore = (skip + products.Count) < totalCount;

        return Ok(new
        {
            products,
            totalCount,
            hasMore,
            page,
            pageSize
        });
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories([FromQuery] string? search = null)
    {
        if (string.IsNullOrEmpty(search))
        {
            var categories = await _context.Categories
                .Select(c => c.Name)
                .OrderBy(name => name)
                .ToListAsync();
            return Ok(categories);
        }
        else
        {
            var searchLower = search.ToLower();
            var categories = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.Name.ToLower().Contains(searchLower) || 
                             p.Description.ToLower().Contains(searchLower) ||
                             p.Brand.ToLower().Contains(searchLower) ||
                             p.Category.Name.ToLower().Contains(searchLower))
                .Select(p => p.Category.Name)
                .Distinct()
                .OrderBy(name => name)
                .ToListAsync();
            return Ok(categories);
        }
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeaturedProducts()
    {
        var products = await _context.Products.Include(p => p.Category).Where(p => p.Featured).ToListAsync();
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
        var product = await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
        if (product == null)
        {
            return NotFound(new { message = $"Product with ID '{id}' was not found." });
        }
        return Ok(product);
    }
}
