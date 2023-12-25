
namespace Server.Application.ViewModels;

public class AdminUserViewModel
{
    public Guid Id { get; set; }
    public string Name { get; set;}
    public string AvatarImageUrl { get; set; }
    public string Email { get; set;}
    public bool IsCritic { get; set; }
}
