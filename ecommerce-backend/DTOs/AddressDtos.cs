using System.ComponentModel.DataAnnotations;

namespace ecommerce_backend.DTOs;

public class AddressDto
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Address { get; set; } = null!;
}

public class CreateAddressDto
{
    [Required]
    public string Name { get; set; } = null!;

    [Required]
    [Phone]
    public string Phone { get; set; } = null!;

    [Required]
    public string Address { get; set; } = null!;
}
