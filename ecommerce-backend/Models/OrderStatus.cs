namespace ecommerce_backend.Models;

/// <summary>
/// Strongly-typed order status — prevents typos like "Procesing", "shipped" etc.
/// Stored as string in DB via EF Core conversion configured in AppDbContext.
/// </summary>
public enum OrderStatus
{
    Processing,
    Shipped,
    Delivered,
    Cancelled
}
