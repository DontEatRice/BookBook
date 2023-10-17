namespace Server.Domain.Entities.Reservations;

public class ReservationBook
{
    public Guid Id { get; set; }
    public Guid ReservationId { get; set; }
    public Guid BookId { get; set; }
    public Guid LibraryId { get; set; }
    
    public static ReservationBook Create(Guid id, Guid reservationId, Guid bookId, Guid libraryId) => new()
    {
        Id = id,
        ReservationId = reservationId,
        BookId = bookId,
        LibraryId = libraryId
    };
}