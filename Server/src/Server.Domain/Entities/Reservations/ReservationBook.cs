namespace Server.Domain.Entities.Reservations;

public class ReservationBook
{
    public Guid Id { get; set; }
    public Guid ReservationId { get; set; }
    public Guid BookId { get; set; }
    public Book Book { get; set; }
    
    public static ReservationBook Create(Guid id, Guid reservationId, Guid bookId) => new()
    {
        Id = id,
        ReservationId = reservationId,
        BookId = bookId,
    };
}