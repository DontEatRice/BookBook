// ReSharper disable UnusedAutoPropertyAccessor.Global
#pragma warning disable CS8618
namespace Server.Application.ViewModels;

public class AuthorViewModel
{
    public Guid Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public int BirthYear { get; set; }
    public string ProfilePictureUrl { get; set; }
    public string? Description { get; set; }
}