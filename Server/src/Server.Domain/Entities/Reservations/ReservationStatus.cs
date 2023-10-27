namespace Server.Domain.Entities.Reservations;

public enum ReservationStatus
{
    Pending,
    GivenOut,
    Returned,
    Cancelled,
    CancelledByAdmin
}