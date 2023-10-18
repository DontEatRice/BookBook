namespace Server.Domain.Entities.Reservations;

public enum ReservationStatus
{
    Pending,
    Fulfilled,
    Returned,
    Overdue,
    Cancelled,
    CancelledByAdmin
}