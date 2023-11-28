namespace Server.Application.ViewModels;

public class ReservationWithBooksViewModel
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public LibraryViewModel Library { get; set; } = null!;
    public List<BookViewModel> Books { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateTime ReservationEndDate { get; set; }
}