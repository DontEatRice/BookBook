using Server.Domain.Entities.Auth;

namespace Server.Domain.DomainServices;

public record AuthTokens(string AccessToken, string RefreshToken);

public interface IIdentityDomainService
{
    Task<Identity> RegisterAsync(Guid id, string email, string password, string name, CancellationToken cancellationToken = default);
    Task<AuthTokens> LoginAsync(string email, string password, Role role, CancellationToken cancellationToken = default);
    Task<AuthTokens> RefreshAccessTokenAsync(string oldRefreshToken,
        CancellationToken cancellationToken = default);
}