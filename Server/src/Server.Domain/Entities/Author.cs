// ReSharper disable CollectionNeverUpdated.Global
#pragma warning disable CS8618
namespace Server.Domain.Entities;

public class Author
{
    public Guid Id { get; private init; }
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public int BirthYear { get; private set; }
    public string? ProfilePictureUrl { get; private set; }
    public string FullText { get; private set; }
    public string? Description { get; private set; }
    public ICollection<Book> Books { get; private init; }

    public static Author Create(Guid id, string firstName, string lastName, int birthYear, string? profilePictureUrl, string? description)
        => new()
        {
            Id = id,
            FirstName = firstName,
            LastName = lastName,
            BirthYear = birthYear,
            ProfilePictureUrl = profilePictureUrl,
            Description = description,
            Books = new List<Book>(),
            FullText = firstName + " " + lastName
        };
}