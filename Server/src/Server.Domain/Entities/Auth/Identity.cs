using Microsoft.OpenApi.Extensions;
using Server.Domain.Entities.User;
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
    public Library? Library { get; private set; }
    public List<string> Roles { get; private init; }
    public List<Session> Sessions { get; private init; }
    public ICollection<UserBook> UserBooks { get; private init; }

    public static Identity Register(Guid id, string email, string password, string name)
    {
        var identity = new Identity
        {
            Id = id,
            Email = email.ToLower(),
            PasswordHash = PasswordHasher.Hash(password),
            Name = name,
            Sessions = new List<Session>(),
            Roles = new List<string> { Role.User.GetDisplayName() },
            UserBooks = new List<UserBook>()
        };

        return identity;
    }

    public static Identity RegisterEmployee(Guid id, string email, string password, string name, Library library)
    {
        var identity = new Identity
        {
            Id = id,
            Email = email.ToLower(),
            PasswordHash = PasswordHasher.Hash(password),
            Name = name,
            Library = library,
            Sessions = new List<Session>(),
            Roles = new List<string> { Role.Employee.GetDisplayName() }
        };

        return identity;
    }

    public void Login(string password, string refreshToken)
    {
        if (PasswordHash == default || !PasswordHasher.Verify(password, PasswordHash))
        {
            throw new DomainException("Invalid Credentials", DomainErrorCodes.InvalidCredentials);
        }

        Sessions.Add(Session.Create(TokenHasher.Hash(refreshToken)));
    }

    public void RemoveRefreshToken(string refreshToken)
    {
        var tokenHash = TokenHasher.Hash(refreshToken);
        var session = Sessions
            .FirstOrDefault(session => session.RefreshTokenHash == tokenHash);
        if (session is not null)
        {
            Sessions.Remove(session);
        }
    }

    public void UpdateRefreshToken(string oldRefreshToken, string newRefreshToken)
    {
        var tokenHash = TokenHasher.Hash(oldRefreshToken);
        var session = Sessions
            .FirstOrDefault(session => session.RefreshTokenHash == tokenHash);
        if (session == default)
        {
            throw new DomainException("Session Does Not Exists", DomainErrorCodes.SessionNotExists);
        }

        Sessions[Sessions.IndexOf(session)] = Session.Create(TokenHasher.Hash(newRefreshToken));
    }
}