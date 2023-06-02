using System.ComponentModel.DataAnnotations;

// ReSharper disable CollectionNeverUpdated.Global
#pragma warning disable CS8618

namespace Server.Domain.Entities;

public class Book
{
    [Key] 
    public Guid Id { get; set; }

    [Required, MaxLength(17)]
    public string ISBN { get; set; }

    [Required] 
    public string Title { get; set; }

    [Required] 
    public int YearPublished { get; set; }

    public string? CoverLink { get; set; }

    public double AverageRating { get; set; }

    public double AverageCriticRating { get; set; }

    public Publisher Publisher { get; set; }

    public ICollection<Author> Authors { get; set; }
    public ICollection<BookCategory> BookCategories { get; set; }

    public static Book Create(string commandName)
    {
        throw new NotImplementedException();
    }
}