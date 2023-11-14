// ReSharper disable CollectionNeverUpdated.Global
#pragma warning disable CS8618
namespace Server.Domain.Entities;

public class Author
{
    public Guid Id { get;  set; }
    public string FirstName { get;  set; }
    public string LastName { get;  set; }
    public int BirthYear { get;  set; }
    public string? ProfilePictureUrl { get;  set; }
    public ICollection<Book> Books { get;  init; }

    public static Author Create(Guid id, string firstName, string lastName, int birthYear, string? profilePictureUrl)
        => new()
        {
            Id = id,
            FirstName = firstName,
            LastName = lastName,
            BirthYear = birthYear,
            ProfilePictureUrl = profilePictureUrl,
            Books = new List<Book>(),
        };
}