using Moq;
using Server.Domain.Entities;
using Server.Domain.Entities.Auth;
using Server.Domain.Exceptions;
using Server.Domain.Repositories;
using Server.Infrastructure.DomainServices;
using Server.Infrastructure.Services;
using Xunit;

namespace Server.Tests.UnitTests.Domain.DomainServices;

public class IdentityDomainServiceTests
{
    private readonly Mock<IIdentityRepository> _identityRepositoryMock;
    private readonly Mock<ISecurityTokenService> _securityTokenServiceMock;
    private readonly IdentityDomainService _identityDomainService;

    public IdentityDomainServiceTests()
    {
        _identityRepositoryMock = new Mock<IIdentityRepository>();
        _securityTokenServiceMock = new Mock<ISecurityTokenService>();
        _identityDomainService =
            new IdentityDomainService(_identityRepositoryMock.Object, _securityTokenServiceMock.Object);
    }

    [Fact]
    public async Task RegisterAsync_WhenIdentityDoesNotExist_ShouldRegisterIdentity()
    {
        // Arrange
        var id = Guid.NewGuid();
        var email = "test@example.com";
        var password = "password";
        var name = "Test User";
        var avatarImageUrl = "https://example.com/avatar.jpg";
        var address = new Address();
        var latitude = 1.0;
        var longitude = 1.0;
        _identityRepositoryMock.Setup(x => x
            .FirstOrDefaultByEmailAsync(email, It.IsAny<CancellationToken>())).ReturnsAsync((Identity)null!);

        // Act
        var identity = await _identityDomainService.RegisterAsync(id, email, password, name, avatarImageUrl,
            address, latitude, longitude);

        // Assert
        Assert.Equal(id, identity.Id);
        Assert.Equal(email.ToLower(), identity.Email);
        Assert.NotNull(identity.PasswordHash);
        Assert.Equal(name, identity.Name);
        Assert.Equal(avatarImageUrl, identity.AvatarImageUrl);
        Assert.Equal(address, identity.Address);
        Assert.Equal(latitude, identity.Latitude);
        Assert.Equal(longitude, identity.Longitude);
    }

    [Fact]
    public async Task RegisterAsync_WhenIdentityExists_ShouldThrowException()
    {
        // Arrange
        var id = Guid.NewGuid();
        var email = "test@example.com";
        var password = "password";
        var name = "Test User";
        var avatarImageUrl = "https://example.com/avatar.jpg";
        var address = new Address();
        var latitude = 1.0;
        var longitude = 1.0;
        var existingIdentity =
            Identity.Register(id, email, password, name, avatarImageUrl, address, latitude, longitude);
        _identityRepositoryMock.Setup(x => x.FirstOrDefaultByEmailAsync(email, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingIdentity);

        // Act
        var exception = await Assert.ThrowsAsync<DomainException>(() => _identityDomainService
            .RegisterAsync(id, email, password, name, avatarImageUrl, address, latitude, longitude));
        
        // Assert
        Assert.Equal(DomainErrorCodes.IdentityExists, exception.ErrorCode);
    }

    [Fact]
    public async Task LoginAsync_WhenIdentityExistsAndPasswordIsValid_ShouldReturnAuthTokens()
    {
        // Arrange
        var email = "test@example.com";
        var password = "password";
        var identity = Identity.Register(Guid.NewGuid(), email, password, "Test User", null, null, null, null);
        _identityRepositoryMock.Setup(x => x.FirstOrDefaultByEmailAsync(email, It.IsAny<CancellationToken>()))
            .ReturnsAsync(identity);
        _securityTokenServiceMock.Setup(x => x.GenerateAccessToken(identity)).Returns("accessToken");
        _securityTokenServiceMock.Setup(x => x.GenerateRefreshToken(identity.Id)).Returns("refreshToken");

        // Act
        var authTokens = await _identityDomainService.LoginAsync(email, password, CancellationToken.None);

        // Assert
        Assert.Equal("accessToken", authTokens.AccessToken);
        Assert.Equal("refreshToken", authTokens.RefreshToken);
    }

    [Fact]
    public async Task RefreshAccessTokenAsync_WhenRefreshTokenIsValid_ShouldReturnNewAuthTokens()
    {
        // Arrange
        var identity = Identity.Register(Guid.NewGuid(), "test@example.com", "password", "Test User", null, null, null, null);
        
        var oldRefreshToken = "oldRefreshToken";
        identity.Login("password", oldRefreshToken);
        
        _securityTokenServiceMock.Setup(x => x.GetIdentityIdAndExpirationTimeFromToken(oldRefreshToken))
            .Returns((identity.Id, DateTime.Now.AddHours(1)));
        _identityRepositoryMock.Setup(x => x.FirstOrDefaultByIdAsync(identity.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(identity);
        _securityTokenServiceMock.Setup(x => x.GenerateAccessToken(identity)).Returns("newAccessToken");
        _securityTokenServiceMock.Setup(x => x.GenerateRefreshToken(identity.Id)).Returns("newRefreshToken");

        // Act
        var authTokens = await _identityDomainService.RefreshAccessTokenAsync(oldRefreshToken, CancellationToken.None);

        // Assert
        Assert.Equal("newAccessToken", authTokens.AccessToken);
        Assert.Equal("newRefreshToken", authTokens.RefreshToken);
    }

    [Fact]
    public async Task LogoutAsync_WhenRefreshTokenIsValid_ShouldNotThrowException()
    {
        // Arrange
        var identity = Identity.Register(Guid.NewGuid(), "test@example.com", "password", "Test User", null, null,
            null, null);
        var refreshToken = "refreshToken";
        _securityTokenServiceMock.Setup(x => x.GetIdentityIdAndExpirationTimeFromToken(refreshToken))
            .Returns((identity.Id, DateTime.Now.AddHours(1)));
        _identityRepositoryMock.Setup(x => x.FirstOrDefaultByIdAsync(identity.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(identity);

        // Act
        await _identityDomainService.LogoutAsync(refreshToken, CancellationToken.None);

        // Assert
        _identityRepositoryMock.Verify(x => x.FirstOrDefaultByIdAsync(identity.Id, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task ChangePasswordAsync_WhenOldPasswordIsValid_ShouldChangePassword()
    {
        // Arrange
        var id = Guid.NewGuid();
        var oldPassword = "oldPassword";
        var newPassword = "newPassword";
        var identity = Identity.Register(id, "test@example.com", oldPassword, "Test User", null, null, null, null);
        _identityRepositoryMock.Setup(x => x.FirstOrDefaultByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(identity);

        // Act
        await _identityDomainService.ChangePasswordAsync(id, oldPassword, newPassword, CancellationToken.None);

        // Assert
        _identityRepositoryMock.Verify(x => x.FirstOrDefaultByIdAsync(id, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task RegisterEmployeeAsync_WhenIdentityDoesNotExist_ShouldRegisterIdentity()
    {
        // Arrange
        var id = Guid.NewGuid();
        var email = "test@example.com";
        var password = "password";
        var name = "Test User";
        var library = new Library();
        _identityRepositoryMock.Setup(x => x.FirstOrDefaultByEmailAsync(email, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Identity)null!);

        // Act
        var identity =
            await _identityDomainService.RegisterEmployeeAsync(id, email, password, name, library,
                CancellationToken.None);

        // Assert
        Assert.Equal(id, identity.Id);
        Assert.Equal(email.ToLower(), identity.Email);
        Assert.NotNull(identity.PasswordHash);
        Assert.Equal(name, identity.Name);
        Assert.Equal(library, identity.Library);
    }
}