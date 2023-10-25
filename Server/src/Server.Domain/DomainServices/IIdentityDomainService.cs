using Server.Domain.Entities;
using Server.Domain.Entities.Auth;

namespace Server.Domain.DomainServices;

public record AuthTokens(string AccessToken, string RefreshToken);

public interface IIdentityDomainService
{
    Task<Identity> RegisterAsync(Guid id, string email, string password, string name, string? avatarImageUrl, CancellationToken cancellationToken = default);
    Task<Identity> RegisterEmployeeAsync(Guid id, string email, string password, string name, Library library, CancellationToken cancellationToken = default);
    Task<AuthTokens> LoginAsync(string email, string password, CancellationToken cancellationToken = default);
    Task<AuthTokens> RefreshAccessTokenAsync(string oldRefreshToken,
        CancellationToken cancellationToken = default);
}