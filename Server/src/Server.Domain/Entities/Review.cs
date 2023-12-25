// ReSharper disable CollectionNeverUpdated.Global

using Server.Domain.Entities.Auth;

#pragma warning disable CS8618

namespace Server.Domain.Entities;

public class Review
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public double Rating { get; set; }
    public Book Book { get; set; }
    public Identity User { get; set; }
    public bool IsCriticRating { get; set; }

    public static Review Create(Guid id, string? title, string? description, double rating,
        Book book, Identity user, bool isCriticRating)
        => new()
        {
            Id = id,
            Title = title,
            Description = description,
            Rating = rating,
            Book = book,
            User = user,
            IsCriticRating = isCriticRating
        };
}