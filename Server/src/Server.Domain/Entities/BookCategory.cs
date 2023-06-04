#pragma warning disable CS8618
namespace Server.Domain.Entities;

public class BookCategory
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public ICollection<Book> Books { get; set; }

    public static BookCategory Create(Guid id, string name) => new()
    {
        Id = id,
        Name = name
    };
}
