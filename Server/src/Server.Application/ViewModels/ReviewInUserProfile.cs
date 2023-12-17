
namespace Server.Application.ViewModels;

public class ReviewInUserProfile
{
    public Guid UserId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public double Rating { get; set; }
    public Guid BookId { get; set; }
    public string? BookCoverUrl { get; set; }
    public string BookTitle { get; set; }
}
