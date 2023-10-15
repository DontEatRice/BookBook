// ReSharper disable CollectionNeverQueried.Global
namespace Server.Application.ViewModels;

public class CartViewModel
{
    public List<LibraryInCartViewModel> LibrariesInCart { get; set; } = new();
}