namespace Server.Application.ViewModels;

public class ReviewWithBookViewModel : ReviewViewModel
{
    public BookInReviewViewModel Book { get; set; } = null!;
}

public sealed class BookInReviewViewModel
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public int YearPublished { get; set; }
    public string? CoverPictureUrl { get; set; }
}