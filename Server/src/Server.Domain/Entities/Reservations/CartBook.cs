namespace Server.Domain.Entities.Reservations;

public class CartBook
{
    public Guid Id { get; set; }
    public Guid BookId { get; set; }
    public Book Book { get; set; }
    public Guid LibraryId { get; set; }
    public Library Library { get; set; }    
    
    public static CartBook Create(Guid bookId, Guid libraryId) => new()
    {
        Id = Guid.NewGuid(),
        BookId = bookId,
        LibraryId = libraryId
    };
}