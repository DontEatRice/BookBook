namespace Server.Application.ViewModels;

public class UserDetailViewModel
{
    public Guid Id { get; set; }
    public string? Name { get;  set; }
    public string? AvatarImageUrl { get; set; }
    public Guid? LibraryId { get; set; }
    public List<string> Roles { get; set; } = new();
    public AddressViewModel? Address { get; set; }
}