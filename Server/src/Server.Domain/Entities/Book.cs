// ReSharper disable CollectionNeverUpdated.Global
#pragma warning disable CS8618

namespace Server.Domain.Entities;

public class Book
{
    public Guid Id { get; set; }
    public string ISBN { get; set; }
    public string Title { get; set; }
    public int YearPublished { get; set; }
    public string? CoverLink { get; set; }
    public double? AverageRating { get; set; }
    public double? AverageCriticRating { get; set; }
    public Publisher Publisher { get; set; }
    public ICollection<Author> Authors { get; set; }
    public ICollection<BookCategory> BookCategories { get; set; }

    public static Book Create(Guid id, string isbn, string title, int yearPublished, string? coverLink,
        Publisher publisher, List<Author> authors, List<BookCategory> categories)
        => new()
        {
            Id = id,
            ISBN = isbn,
            Title = title,
            YearPublished = yearPublished,
            CoverLink = coverLink,
            AverageRating = null,
            AverageCriticRating = null,
            Publisher = publisher,
            Authors = authors,
            BookCategories = categories
        };
}