using System;
using System.Text.Json.Serialization;

namespace ecommerce_backend.Models;

public class AddressBook
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string UserId { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Address { get; set; } = null!;

    // Navigation Property
    [JsonIgnore]
    public User User { get; set; } = null!;
}
