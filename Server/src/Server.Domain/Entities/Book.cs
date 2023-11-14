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
    public string FullText { get; set; }
    public Publisher Publisher { get; set; }
    public ICollection<Author> Authors { get; set; }
    public ICollection<BookCategory> BookCategories { get; set; }
    public ICollection<LibraryBook> BookLibraries { get; set; }
    public ICollection<Review> Reviews { get; set; }
    public ICollection<UserBook> UserBooks { get; set; }

    public static Book Create(Guid id, string isbn, string title, int yearPublished,
        Publisher publisher, List<Author> authors, List<BookCategory> categories)
        => new()
        {
            Id = id,
            ISBN = isbn,
            Title = title,
            YearPublished = yearPublished,
            AverageRating = null,
            AverageCriticRating = null,
            Publisher = publisher,
            Authors = authors,
            BookCategories = categories,
            BookLibraries = new List<LibraryBook>(),
            Reviews = new List<Review>(),
            FullText = isbn + " " + title + " " + yearPublished + " " + publisher.Name + " " + string.Join(" ", authors.Select(x => x.LastName)),
            UserBooks = new List<UserBook>()
        };
}