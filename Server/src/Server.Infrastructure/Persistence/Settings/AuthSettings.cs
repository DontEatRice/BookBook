#pragma warning disable CS8618
namespace Server.Infrastructure.Persistence.Settings;

public class AuthSettings
{
    public string Issuer { get; set; }
    public string Audience { get; set; }
    public string Key { get; set; }
}