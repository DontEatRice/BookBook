using Microsoft.OpenApi.Extensions;
using Server.Domain.Exceptions;
using Server.Utils;
#pragma warning disable CS8618

namespace Server.Domain.Entities.Auth;

public class Identity
{
    public Guid Id { get; private init; }
    public string Email { get; private init; }
    public string? PasswordHash { get; private set; }
    public string? Name { get; private set; }
    public List<string> Roles { get; private init; }
    public List<Session> Sessions { get; private init; }

    public static Identity Register(Guid id, string email, string password, string name)
    {
        var identity = new Identity
        {
            Id = id,
            Email = email.ToLower(),
            PasswordHash = PasswordHasher.Hash(password),
            Name = name,
            Sessions = new List<Session>(),
            Roles = new List<string> { Role.User.GetDisplayName() }
        };

        return identity;
    }

    public void Login(string password, string refreshToken, Role role = Role.User)
    {
        if (PasswordHash == default || !PasswordHasher.Verify(password, PasswordHash) || !Roles.Contains(role.GetDisplayName()))
        {
            throw new DomainException("Invalid Credentials", DomainErrorCodes.InvalidCredentials);
        }

        Sessions.Add(Session.Create(TokenHasher.Hash(refreshToken)));
    }

    public void UpdateRefreshToken(string oldRefreshToken, string newRefreshToken)
    {
        var session = Sessions
            .FirstOrDefault(session => session.RefreshTokenHash == TokenHasher.Hash(oldRefreshToken));
        if (session == default)
        {
            throw new DomainException("Session Does Not Exists", DomainErrorCodes.SessionNotExists);
        }

        Sessions[Sessions.IndexOf(session)] = Session.Create(TokenHasher.Hash(newRefreshToken));
    }
}