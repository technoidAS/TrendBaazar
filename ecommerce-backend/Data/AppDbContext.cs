using Microsoft.EntityFrameworkCore;
using ecommerce_backend.Models;

namespace ecommerce_backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<AddressBook> AddressBooks { get; set; } = null!;
    public DbSet<Product> Products { get; set; } = null!;
    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<OrderItem> OrderItems { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User unique index on Phone
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Phone)
            .IsUnique();

        // Configure User relationships
        modelBuilder.Entity<User>()
            .HasMany(u => u.Addresses)
            .WithOne(a => a.User)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<User>()
            .HasMany(u => u.Orders)
            .WithOne(o => o.User)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure Order relationship
        modelBuilder.Entity<Order>()
            .HasMany(o => o.Items)
            .WithOne(oi => oi.Order)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure MS SQL Server JSON converters for string lists
        var stringListConverter = new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<List<string>, string>(
            v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions)null!),
            v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions)null!) ?? new List<string>()
        );

        // Add ValueComparer for correct change tracking on string lists in SQL Server
        var stringListComparer = new Microsoft.EntityFrameworkCore.ChangeTracking.ValueComparer<List<string>>(
            (c1, c2) => (c1 == null && c2 == null) || (c1 != null && c2 != null && c1.SequenceEqual(c2)),
            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
            c => c.ToList()
        );

        modelBuilder.Entity<Product>()
            .Property(p => p.Images)
            .HasConversion(stringListConverter)
            .Metadata.SetValueComparer(stringListComparer);

        modelBuilder.Entity<Product>()
            .Property(p => p.Features)
            .HasConversion(stringListConverter)
            .Metadata.SetValueComparer(stringListComparer);

        modelBuilder.Entity<Product>()
            .Property(p => p.Sizes)
            .HasConversion(stringListConverter)
            .Metadata.SetValueComparer(stringListComparer);

        modelBuilder.Entity<Product>()
            .Property(p => p.Colors)
            .HasConversion(stringListConverter)
            .Metadata.SetValueComparer(stringListComparer);
    }
}
