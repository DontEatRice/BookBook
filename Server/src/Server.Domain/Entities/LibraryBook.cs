namespace Server.Domain.Entities;

public class LibraryBook
{
    public Guid LibraryId { get; set; }
    public Guid BookId { get; set; }
    public Library Library { get; set; } = null!;
    public Book Book { get; set; } = null!;
    public int Amount { get; set; }
    public int Available { get; set; }

    public static LibraryBook Create(Library library, Book book, int amount) => new()
    {
        LibraryId = library.Id,
        BookId = book.Id,
        Library = library,
        Book = book,
        Amount = amount,
        Available = amount
    };
}
