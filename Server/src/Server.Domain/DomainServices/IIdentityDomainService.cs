using Server.Domain.Entities;
using Server.Domain.Entities.Auth;

namespace Server.Domain.DomainServices;

public record AuthTokens(string AccessToken, string RefreshToken);

public interface IIdentityDomainService
{
    Task<Identity> RegisterAsync(Guid id, string email, string password, string name, string? avatarImageUrl, Address? address, double? latitude, double? longitude, CancellationToken cancellationToken = default);
    Task<Identity> RegisterEmployeeAsync(Guid id, string email, string password, string name, Library library, CancellationToken cancellationToken = default);
    Task<AuthTokens> LoginAsync(string email, string password, CancellationToken cancellationToken = default);
    Task<AuthTokens> RefreshAccessTokenAsync(string oldRefreshToken,
        CancellationToken cancellationToken = default);
    Task ChangePasswordAsync(Guid id, string oldPassword, string newPassword, CancellationToken cancellationToken = default);
}