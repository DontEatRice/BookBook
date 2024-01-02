namespace Server.Application.ViewModels;

public class UserProfileViewModel
{
    public required string UserName { get; set; }
    public string? UserImageUrl { get; set; }
    public List<BookViewModel>? UserLastReadBooks { get; set; }
    public string? UserLocation { get; set; }
    public string? AboutMe { get; set; }
    public int? ReadBooksCount { get; set; }
    public int FollowersCount { get; set; }
    public bool IsCritic { get; set; }
    public DateTime RegisteredAt { get; set; }
    public bool? FollowedByMe { get; set; }
}
