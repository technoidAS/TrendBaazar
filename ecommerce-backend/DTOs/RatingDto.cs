using System.ComponentModel.DataAnnotations;

namespace ecommerce_backend.DTOs;

public class SubmitRatingDto
{
    [Required]
    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5 stars.")]
    public int Rating { get; set; }
}

public class RatingResponseDto
{
    public string ProductId { get; set; } = null!;
    public double NewAverageRating { get; set; }
    public int NewReviewCount { get; set; }
    public int UserRating { get; set; }  // The rating this specific user submitted
}
