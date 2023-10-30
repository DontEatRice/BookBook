namespace Server.Application.ViewModels;

public class ReservationViewModel
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public LibraryViewModel Library { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateTime ReservationEndDate { get; set; }
}