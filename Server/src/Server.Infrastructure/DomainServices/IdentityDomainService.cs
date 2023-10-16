using Server.Domain.DomainServices;
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
            name: name
        );

        return identity;
    }
    
    public async Task<AuthTokens> LoginAsync(string email, string password, Role loginAs,
        CancellationToken cancellationToken)
    {
        var identity = await _identityRepository.FirstOrDefaultByEmailAsync(email, cancellationToken);
        if (identity == default)
        {
            throw new DomainException("Invalid credentials", DomainErrorCodes.InvalidCredentials);
        }

        var accessToken = _securityTokenService.GenerateAccessToken(identity.Id, identity.Email, loginAs);
        var refreshToken = _securityTokenService.GenerateRefreshToken(identity.Id);

        identity.Login(
            password: password,
            refreshToken: refreshToken,
            role: loginAs
        );

        return new AuthTokens(accessToken, refreshToken);
    }

    public async Task<AuthTokens> RefreshAccessTokenAsync(string oldRefreshToken, CancellationToken cancellationToken)
    {
        var identityId = _securityTokenService.GetIdentityIdFromRefreshToken(oldRefreshToken);
        // var loggedAs = _securityTokenService.GetIdentityRoleFromRefreshToken(oldRefreshToken);

        if (!identityId.HasValue)
        {
            throw new DomainException("Invalid refresh token", DomainErrorCodes.InvalidRefreshToken);
        }

        var identity = await _identityRepository.FirstOrDefaultByIdAsync(identityId.Value, cancellationToken);
        
        if (identity == default)
        {
            throw new DomainException("Invalid refresh token", DomainErrorCodes.InvalidRefreshToken);
        }

        if (!Enum.TryParse<Role>(identity.Roles[0], out var loggedAs))
        {
            loggedAs = Role.User;
        }
        var accessToken = _securityTokenService.GenerateAccessToken(identity.Id, identity.Email, loggedAs);
        var refreshToken = _securityTokenService.GenerateRefreshToken(identity.Id);

        identity.UpdateRefreshToken(
            oldRefreshToken: oldRefreshToken,
            newRefreshToken: refreshToken
        );

        return new AuthTokens(accessToken, refreshToken);
    }
}