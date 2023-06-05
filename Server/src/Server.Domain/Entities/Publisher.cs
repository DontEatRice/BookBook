// ReSharper disable CollectionNeverUpdated.Global

#pragma warning disable CS8618

namespace Server.Domain.Entities;

public class Publisher
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public ICollection<Book> Books { get; set; }

    public static Publisher Create(Guid id, string name)
        => new()
        {
            Id = id,
            Name = name,
            Books = new List<Book>()
        };
}