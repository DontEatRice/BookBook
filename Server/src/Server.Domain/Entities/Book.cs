// ReSharper disable CollectionNeverUpdated.Global
#pragma warning disable CS8618

using Server.Domain.Entities.User;

namespace Server.Domain.Entities;

public class Book
{
    public Guid Id { get; set; }
    public string ISBN { get; set; }
    public string Title { get; set; }
    public int YearPublished { get; set; }
    public double? AverageRating { get; set; }
    public double? AverageCriticRating { get; set; }
    public string? Description { get; set; }
    public string Language { get; set; }
    public int? PageCount { get; set; }
    public string? CoverPictureUrl { get; set; }
    public string FullText { get; set; }
    public Publisher Publisher { get; set; }
    public ICollection<Author> Authors { get; set; }
    public ICollection<BookCategory> BookCategories { get; set; }
    public ICollection<LibraryBook> BookLibraries { get; set; }
    public ICollection<Review> Reviews { get; set; }
    public ICollection<UserBook> UserBooks { get; set; }

    public static Book Create(Guid id, string isbn, string title, int yearPublished,
        string? description, string language, int? pageCount, string? coverPictureUrl,
        Publisher publisher, List<Author> authors, List<BookCategory> categories)
        => new()
        {
            Id = id,
            ISBN = isbn,
            Title = title,
            YearPublished = yearPublished,
            AverageRating = null,
            AverageCriticRating = null,
            Description = description,
            Language = language,
            PageCount = pageCount,
            CoverPictureUrl = coverPictureUrl,
            Publisher = publisher,
            Authors = authors,
            BookCategories = categories,
            BookLibraries = new List<LibraryBook>(),
            Reviews = new List<Review>(),
            FullText = isbn + " " + title + " " + yearPublished + " " + publisher.Name + " " + string.Join(" ", authors.Select(x => x.LastName)),
            UserBooks = new List<UserBook>()
        };

    public void ComputeRating(int reviewsCount, double reviewRating)
    {
        var averageRating = AverageRating ?? 0;
        
        AverageRating = Math.Round((averageRating * reviewsCount + reviewRating) / (reviewsCount + 1), 2);
    }

    public void ComputeCriticRating(int reviewsCount, double reviewRating)
    {
        var averageCriticRating = AverageCriticRating ?? 0;

        AverageCriticRating = Math.Round((averageCriticRating * reviewsCount + reviewRating) / (reviewsCount + 1), 2);
    }
    
    public void SubtractReviewFromRating(int reviewsCount, double reviewRating)
    {
        var averageRating = AverageRating ?? 0;

        if (reviewsCount <= 1)
        {
            AverageRating = null;
            return;
        }
        
        AverageRating = Math.Round((averageRating * reviewsCount - reviewRating) / (reviewsCount - 1), 2);
    }

    public void SubtractReviewFromCriticRating(int reviewsCount, double reviewRating)
    {
        var averageCriticRating = AverageCriticRating ?? 0;

        if (reviewsCount <= 1)
        {
            AverageCriticRating = null;
            return;
        }

        AverageCriticRating = Math.Round((averageCriticRating * reviewsCount - reviewRating) / (reviewsCount - 1), 2);
    }

    public void UpdateReviewRating(int reviewsCount, double oldReviewRating, double newReviewRating)
    {
        var averageRating = AverageRating ?? 0;
        
        AverageRating = Math.Round((averageRating * reviewsCount - oldReviewRating + newReviewRating) / (reviewsCount), 2);
    }

    public void UpdateCriticReviewRating(int reviewsCount, double oldReviewRating, double newReviewRating)
    {
        var averageCriticRating = AverageCriticRating ?? 0;

        AverageCriticRating = Math.Round((averageCriticRating * reviewsCount - oldReviewRating + newReviewRating) / (reviewsCount), 2);
    }
}