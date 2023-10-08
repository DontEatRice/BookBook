#pragma warning disable CS8618
namespace Server.Domain.Entities.Auth;

public class Session
{
    public string RefreshTokenHash { get; private init; }

    public static Session Create(string refreshTokenHash)
    {
        return new Session { RefreshTokenHash = refreshTokenHash };
    }
}