using Server.Domain.Entities.Auth;

namespace Server.Domain.Entities.Reservations;

public class Reservation
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Identity Identity { get; set; }
    public Guid LibraryId { get; set; }
    public Library Library { get; set; }
    public ICollection<ReservationBook> ReservationItems { get; private init; } = null!;
    public DateTime ReservationEndDate { get; set; }
    public ReservationStatus Status { get; set; }
    public DateTime CreatedAt { get; private init; }
    
    
    public static Reservation Create(Guid id, Guid userId, Guid libraryId, int reservationTime) => new()
    {
        Id = id,
        UserId = userId,
        LibraryId = libraryId,
        ReservationItems = new List<ReservationBook>(),
        ReservationEndDate = DateTime.UtcNow.AddDays(reservationTime),
        Status = ReservationStatus.Pending,
        CreatedAt = DateTime.UtcNow
    };
}