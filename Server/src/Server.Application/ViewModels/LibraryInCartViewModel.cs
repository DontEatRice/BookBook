namespace Server.Application.ViewModels;

public class LibraryInCartViewModel
{
    public LibraryViewModel Library { get; set; } = new();
    public List<BookViewModel> Books { get; set; } = new();
}