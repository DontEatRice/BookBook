namespace Server.Application.ViewModels;

public sealed class UserInfoViewModel
{
    public Guid Id { get; set; }
    public required string UserName { get; set; }
    public string? UserImageUrl { get; set; }
    public bool IsCritic { get; set; }
    public string? AboutMe { get; set; }
}