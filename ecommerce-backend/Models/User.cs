using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ecommerce_backend.Models;

public class User
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Phone { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Email { get; set; } = "";
    public string Avatar { get; set; } = "";
    public string Role { get; set; } = "customer"; // "customer" | "admin"

    // Persisted cart — stored as JSON string in DB column
    // Allows cart to survive logout, device switches, browser clears
    public string CartJson { get; set; } = "[]";

    // Audit timestamp
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relationships
    public List<AddressBook> Addresses { get; set; } = new();
    [JsonIgnore]
    public List<Order> Orders { get; set; } = new();
    [JsonIgnore]
    public List<ProductReview> Reviews { get; set; } = new();
}
