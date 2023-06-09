// ReSharper disable UnusedAutoPropertyAccessor.Global
#pragma warning disable CS8618
namespace Server.Application.ViewModels;

public class BookViewModel
{
    public Guid Id { get; set; }
    public string ISBN { get; set; }
    public string Title { get; set; }
    public int YearPublished { get; set; }
    public string? CoverLink { get; set; }
    public double? AverageRating { get; set; }
    public double? AverageCriticRating { get; set; }
    public PublisherViewModel Publisher { get; set; }
    public ICollection<AuthorViewModel> Authors { get; set; }
    public ICollection<BookCategoryViewModel> BookCategories { get; set; }
}