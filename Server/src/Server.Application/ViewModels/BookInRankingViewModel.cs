// ReSharper disable CollectionNeverUpdated.Global
#pragma warning disable CS8618
namespace Server.Application.ViewModels;

public class BookInRankingViewModel
{
    public Guid Id { get; set; }
    public string ISBN { get; set; }
    public string Title { get; set; }
    public double? AverageRating { get; set; }
    public double? AverageCriticRating { get; set; }
    public string? CoverPictureUrl { get; set; }
    public ICollection<AuthorViewModel> Authors { get; set; }
    public PublisherViewModel Publisher { get; set; }
    public ICollection<BookCategoryViewModel> BookCategories { get; set; }
    public int ReviewsCount { get; set; }
    public int CriticReviewsCount { get; set; }
}