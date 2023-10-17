namespace Server.Domain.Entities;

public class BookCategory
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public ICollection<Book> Books { get; set; } = new List<Book>();

    public static BookCategory Create(Guid id, string name) => new()
    {
        Id = id,
        Name = name,
        Books = new List<Book>()
    };
}
