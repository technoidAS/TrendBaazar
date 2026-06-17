using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ecommerce_backend.DTOs;

public class OtpRequestDto
{
    [Required]
    [Phone]
    public string Phone { get; set; } = null!;
}

public class OtpVerifyDto
{
    [Required]
    [Phone]
    public string Phone { get; set; } = null!;

    [Required]
    public string Code { get; set; } = null!;
}

public class AuthResponseDto
{
    public string Token { get; set; } = null!;
    public UserProfileDto User { get; set; } = null!;
}

public class AuthFlowResponseDto
{
    public string Message { get; set; } = string.Empty;
    public string NextStep { get; set; } = string.Empty;
    public bool UserExists { get; set; }
}

public class SignupRequestDto
{
    [Required]
    [Phone]
    public string Phone { get; set; } = null!;

    [Required]
    public string Name { get; set; } = null!;

    public string Email { get; set; } = string.Empty;

    public string Avatar { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;
}

public class UserProfileDto
{
    public string Id { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Email { get; set; } = "";
    public string Avatar { get; set; } = "";
    public string Address { get; set; } = "";
    public string Role { get; set; } = "customer";
    public List<AddressDto> Addresses { get; set; } = new();
}

public class UpdateProfileDto
{
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Avatar { get; set; } = "";
    public List<AddressDto>? Addresses { get; set; }
}

