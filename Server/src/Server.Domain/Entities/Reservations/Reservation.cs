namespace Server.Domain.Entities.Reservations;

public class Reservation
{
    public const int ReservationTimeInDays = 30;
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid LibraryId { get; set; }
    public ICollection<ReservationBook> ReservationItems { get; private init; } = null!;
    public DateTime ReservationEndDate { get; set; }
    public ReservationStatus Status { get; set; }
    
    
    public static Reservation Create(Guid id, Guid userId, Guid libraryId) => new()
    {
        Id = id,
        UserId = userId,
        LibraryId = libraryId,
        ReservationItems = new List<ReservationBook>(),
        ReservationEndDate = DateTime.UtcNow.AddDays(ReservationTimeInDays),
        Status = ReservationStatus.Pending
    };
}