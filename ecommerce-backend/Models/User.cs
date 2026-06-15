using System;
using System.Collections.Generic;

namespace ecommerce_backend.Models;

public class User
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Phone { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Email { get; set; } = "";
    public string Avatar { get; set; } = "";
    public string Role { get; set; } = "customer"; // "customer" | "admin"
    public string Address { get; set; } = "";

    // Persisted cart — stored as JSON string in DB column
    // Allows cart to survive logout, device switches, browser clears
    public string CartJson { get; set; } = "[]";

    // Relationships
    public List<AddressBook> Addresses { get; set; } = new();
    public List<Order> Orders { get; set; } = new();
}
