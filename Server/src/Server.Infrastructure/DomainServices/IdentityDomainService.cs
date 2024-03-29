using Server.Domain.DomainServices;
using Server.Domain.Entities;
using Server.Domain.Entities.Auth;
using Server.Domain.Exceptions;
using Server.Domain.Repositories;
using Server.Infrastructure.Services;

namespace Server.Infrastructure.DomainServices;

public class IdentityDomainService : IIdentityDomainService
{
    private readonly IIdentityRepository _identityRepository;
    private readonly ISecurityTokenService _securityTokenService;

    public IdentityDomainService(IIdentityRepository identityRepository, ISecurityTokenService securityTokenService)
    {
        _identityRepository = identityRepository;
        _securityTokenService = securityTokenService;
    }

    public async Task<Identity> RegisterAsync(
        Guid id,
        string email,
        string password,
        string name,
        string? avatarImageUrl,
        Address? address,
        double? latitude,
        double? longitude,
        CancellationToken cancellationToken = default)
    {
        var existing = await _identityRepository.FirstOrDefaultByEmailAsync(email, cancellationToken);
        if (existing != default)
        {
            throw new DomainException("Identity with provided email already exists.", DomainErrorCodes.IdentityExists);
        }

        var identity = Identity.Register(
            id: id,
            email: email,
            password: password,
            name: name,
            avatarImageUrl,
            address,
            latitude,
            longitude
        );

        return identity;
    }
    
    public async Task<AuthTokens> LoginAsync(string email, string password,
        CancellationToken cancellationToken)
    {
        var identity = await _identityRepository.FirstOrDefaultByEmailAsync(email, cancellationToken);
        if (identity == default)
        {
            throw new DomainException("Invalid credentials", DomainErrorCodes.InvalidCredentials);
        }

        var accessToken = _securityTokenService.GenerateAccessToken(identity);
        var refreshToken = _securityTokenService.GenerateRefreshToken(identity.Id);

        identity.Login(
            password: password,
            refreshToken: refreshToken
        );

        return new AuthTokens(accessToken, refreshToken);
    }

    public async Task<AuthTokens> RefreshAccessTokenAsync(string oldRefreshToken, CancellationToken cancellationToken)
    {
        var (identityId, validTo) = _securityTokenService.GetIdentityIdAndExpirationTimeFromToken(oldRefreshToken);

        if (!identityId.HasValue)
        {
            throw new DomainException("Invalid refresh token", DomainErrorCodes.InvalidRefreshToken);
        }

        var identity = await _identityRepository.FirstOrDefaultByIdAsync(identityId.Value, cancellationToken);
        
        if (identity == default)
        {
            throw new DomainException("Invalid refresh token", DomainErrorCodes.InvalidRefreshToken);
        }

        if (validTo <= DateTime.Now)
        {
            identity.RemoveRefreshToken(oldRefreshToken);
            throw new DomainException("Invalid refresh token", DomainErrorCodes.InvalidRefreshToken);
        }
        
        var accessToken = _securityTokenService.GenerateAccessToken(identity);
        var refreshToken = _securityTokenService.GenerateRefreshToken(identity.Id);

        identity.UpdateRefreshToken(
            oldRefreshToken: oldRefreshToken,
            newRefreshToken: refreshToken
        );

        return new AuthTokens(accessToken, refreshToken);
    }

    public async Task LogoutAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        var (identityId, _) = _securityTokenService.GetIdentityIdAndExpirationTimeFromToken(refreshToken);
        
        if (!identityId.HasValue)
        {
            throw new DomainException("Invalid refresh token", DomainErrorCodes.InvalidRefreshToken);
        }
        
        var identity = await _identityRepository.FirstOrDefaultByIdAsync(identityId.Value, cancellationToken);
        
        if (identity == default)
        {
            throw new DomainException("Invalid refresh token", DomainErrorCodes.InvalidRefreshToken);
        }
        
        identity.RemoveRefreshToken(refreshToken);
    }

    public async Task ChangePasswordAsync(Guid id, string oldPassword, string newPassword, CancellationToken cancellationToken = default)
    {
        if (oldPassword == newPassword)
        {
            throw new DomainException("New password can not be the same as the old one",
                DomainErrorCodes.SamePasswords);
        }
        var identity = await _identityRepository.FirstOrDefaultByIdAsync(id, cancellationToken) ??
                       throw new DomainException("Identity does not exists", DomainErrorCodes.IdentityDoesNotExists);
        identity.ChangePassword(oldPassword, newPassword);
    }

    public async Task<Identity> RegisterEmployeeAsync(
        Guid id,
        string email,
        string password,
        string name,
        Library library,
        CancellationToken cancellationToken = default)
    {
        var existing = await _identityRepository.FirstOrDefaultByEmailAsync(email, cancellationToken);
        if (existing != default)
        {
            throw new DomainException("Identity with provided email already exists.", DomainErrorCodes.IdentityExists);
        }

        var identity = Identity.RegisterEmployee(
            id: id,
            email: email,
            password: password,
            name: name,
            library: library
        );

        return identity;
    }
}