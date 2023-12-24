
namespace Server.Application.ViewModels;

public class AdminUserViewModel
{
    public Guid UserId { get; set; }
    public string UserName { get; set;}
    public string Email { get; set;}
    public bool IsCritic { get; set; }
}
