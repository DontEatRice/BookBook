// ReSharper disable CollectionNeverUpdated.Global
#pragma warning disable CS8618
namespace Server.Domain.Entities;

public class Author
{
    public Guid Id { get; private init; }
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public int BirthYear { get; private set; }
    public ICollection<Book> Books { get; private init; }

    public static Author Create(Guid id, string firstName, string lastName, int birthYear)
        => new()
        {
            Id = id,
            FirstName = firstName,
            LastName = lastName,
            BirthYear = birthYear,
            Books = new List<Book>(),
        };
}