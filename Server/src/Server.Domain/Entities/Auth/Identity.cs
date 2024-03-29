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
    public string? AvatarImageUrl { get; private set; }
    public Guid? LibraryId { get; private set; }
    public Library? Library { get; private set; }
    public Role Role { get; private init; }
    public List<Session> Sessions { get; private init; }
    public ICollection<UserBook> UserBooks { get; private init; }
    public Address? Address { get; private set; }
    public double? Latitude { get; private set; }
    public double? Longitude { get; private set; }
    public string? AboutMe { get; private set; }
    public bool IsCritic { get; set; }
    public DateTime RegisteredAt { get; private set; }
    public ICollection<Identity> Followers { get; set; } = new List<Identity>();
    public ICollection<Identity> Followed { get; set; } = new List<Identity>();

    public static Identity Register(Guid id, string email, string password, string name, string? avatarImageUrl, Address? address, double? latitude, double? longitude)
    {
        var identity = new Identity
        {
            Id = id,
            Email = email.ToLower(),
            PasswordHash = PasswordHasher.Hash(password),
            Name = name,
            AvatarImageUrl = avatarImageUrl,
            Sessions = new List<Session>(),
            Role = Role.User,
            UserBooks = new List<UserBook>(),
            Address = address,
            Latitude = latitude,
            Longitude = longitude,
            AboutMe = "",
            IsCritic = false,
            RegisteredAt = DateTime.Now
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
            Role = Role.Employee,
            Address = null,
            Latitude = null,
            Longitude = null,
            IsCritic = false,
            RegisteredAt = DateTime.Now
        };

        return identity;
    }

    public void Login(string password, string refreshToken)
    {
        if (PasswordHash == default || !PasswordHasher.Verify(password, PasswordHash))
        {
            throw new DomainException("Invalid Credentials", DomainErrorCodes.InvalidCredentials);
        }

        var tokenHash = TokenHasher.Hash(refreshToken);
        Sessions.Add(Session.Create(tokenHash));
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
    
    public void ChangePassword(string oldPassword, string newPassword) 
    {
        if (PasswordHash == default || !PasswordHasher.Verify(oldPassword, PasswordHash))
        {
            throw new DomainException("Invalid Credentials", DomainErrorCodes.InvalidCredentials);
        }

        PasswordHash = PasswordHasher.Hash(newPassword);
        Sessions.Clear();
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

        Sessions.Remove(session);
        Sessions.Add(Session.Create(TokenHasher.Hash(newRefreshToken)));
    }

    public void Update(string name, string? avatarImageUrl, Guid? libraryId, Address? address, double? latitude, double? longitude, string? aboutMe)
    {
        Name = name;
        AvatarImageUrl = avatarImageUrl;
        LibraryId = libraryId;
        Address = address;
        Latitude = latitude;
        Longitude = longitude;
        AboutMe = aboutMe;
    }
}