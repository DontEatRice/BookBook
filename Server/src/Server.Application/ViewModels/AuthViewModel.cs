using System.Text.Json.Serialization;

#pragma warning disable CS8618
namespace Server.Application.ViewModels;

public class AuthViewModel
{
    public string AccessToken { get; set; }
    [JsonIgnore]
    public string RefreshToken { get; set; }
}