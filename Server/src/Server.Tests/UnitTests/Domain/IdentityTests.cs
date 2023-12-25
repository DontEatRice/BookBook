
using Xunit;
using Server.Domain.Entities.Auth;
using Server.Domain.Exceptions;
using Microsoft.OpenApi.Extensions;
using Server.Domain.Entities;
using Server.Utils;

namespace Server.Tests.UnitTests.Domain
{
    public class IdentityTests
    {
        [Fact]
        public void Register_ShouldCreateIdentity()
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

            // Act
            var identity = Identity.Register(id, email, password, name, avatarImageUrl, address, latitude, longitude);

            // Assert
            Assert.Equal(id, identity.Id);
            Assert.Equal(email.ToLower(), identity.Email);
            Assert.NotNull(identity.PasswordHash);
            Assert.Equal(name, identity.Name);
            Assert.Equal(avatarImageUrl, identity.AvatarImageUrl);
            Assert.Equal(address, identity.Address);
            Assert.Equal(latitude, identity.Latitude);
            Assert.Equal(longitude, identity.Longitude);
            Assert.Equal("", identity.AboutMe);
            Assert.Contains(Role.User.GetDisplayName(), identity.Roles);
        }

        [Fact]
        public void Login_WithCorrectPassword_ShouldAddSession()
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
            var identity = Identity.Register(id, email, password, name, avatarImageUrl, address, latitude, longitude);
            var refreshToken = "refreshToken";

            // Act
            identity.Login(password, refreshToken);

            // Assert
            Assert.Single(identity.Sessions);
        }

        [Fact]
        public void Login_WithIncorrectPassword_ShouldThrowException()
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
            var identity = Identity.Register(id, email, password, name, avatarImageUrl, address, latitude, longitude);
            var refreshToken = "refreshToken";

            // Act
            var exception = Assert.Throws<DomainException>(() => identity.Login("wrongPassword", refreshToken));
            
            // Assert
            Assert.Equal(DomainErrorCodes.InvalidCredentials, exception.ErrorCode);
        }

        [Fact]
        public void RemoveRefreshToken_WhenTokenExists_ShouldRemoveSession()
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
            var identity = Identity.Register(id, email, password, name, avatarImageUrl, address, latitude, longitude);
            var refreshToken = "refreshToken";
            identity.Login(password, refreshToken);

            // Act
            identity.RemoveRefreshToken(refreshToken);

            // Assert
            Assert.Empty(identity.Sessions);
        }

        [Fact]
        public void RemoveRefreshToken_WhenTokenDoesNotExist_ShouldNotThrowException()
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
            var identity = Identity.Register(id, email, password, name, avatarImageUrl, address, latitude, longitude);

            // Act
            identity.RemoveRefreshToken("nonExistingToken");

            // Assert
            Assert.Empty(identity.Sessions);
        }

        [Fact]
        public void ChangePassword_WithCorrectOldPassword_ShouldChangePassword()
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
            var identity = Identity.Register(id, email, password, name, avatarImageUrl, address, latitude, longitude);
            var oldPasswordHash = identity.PasswordHash;
            var newPassword = "newPassword";

            // Act
            identity.ChangePassword(password, newPassword);

            // Assert
            Assert.NotEqual(oldPasswordHash, identity.PasswordHash);
            Assert.Empty(identity.Sessions);
        }

        [Fact]
        public void ChangePassword_WithIncorrectOldPassword_ShouldThrowException()
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
            var identity = Identity.Register(id, email, password, name, avatarImageUrl, address, latitude, longitude);
            var newPassword = "newPassword";

            // Act
            var exception = Assert.Throws<DomainException>(() => identity.ChangePassword("wrongPassword", newPassword));
            
            // Assert
            Assert.Equal(DomainErrorCodes.InvalidCredentials, exception.ErrorCode);
        }

        [Fact]
        public void UpdateRefreshToken_WhenOldTokenExists_ShouldUpdateSession()
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
            var identity = Identity.Register(id, email, password, name, avatarImageUrl, address, latitude, longitude);
            var oldRefreshToken = "oldRefreshToken";
            var newRefreshToken = "newRefreshToken";
            identity.Login(password, oldRefreshToken);

            // Act
            identity.UpdateRefreshToken(oldRefreshToken, newRefreshToken);

            // Assert
            Assert.Single(identity.Sessions);
            Assert.Equal(TokenHasher.Hash(newRefreshToken), identity.Sessions.First().RefreshTokenHash);
        }

        [Fact]
        public void UpdateRefreshToken_WhenOldTokenDoesNotExist_ShouldThrowException()
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
            var identity = Identity.Register(id, email, password, name, avatarImageUrl, address, latitude, longitude);
            var oldRefreshToken = "oldRefreshToken";
            var newRefreshToken = "newRefreshToken";

            // Act
            var exception = Assert.Throws<DomainException>(() => identity.UpdateRefreshToken(oldRefreshToken, newRefreshToken));
            
            // Assert
            Assert.Equal(DomainErrorCodes.SessionNotExists, exception.ErrorCode);
        }

        [Fact]
        public void Update_ShouldUpdateIdentity()
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
            var identity = Identity.Register(id, email, password, name, avatarImageUrl, address, latitude, longitude);
            var newName = "New Name";
            var newAvatarImageUrl = "https://example.com/newAvatar.jpg";
            var newLibraryId = Guid.NewGuid();
            var newAddress = new Address();
            var newLatitude = 2.0;
            var newLongitude = 2.0;
            var newAboutMe = "New About Me";

            // Act
            identity.Update(newName, newAvatarImageUrl, newLibraryId, newAddress, newLatitude, newLongitude, newAboutMe);

            // Assert
            Assert.Equal(newName, identity.Name);
            Assert.Equal(newAvatarImageUrl, identity.AvatarImageUrl);
            Assert.Equal(newLibraryId, identity.LibraryId);
            Assert.Equal(newAddress, identity.Address);
            Assert.Equal(newLatitude, identity.Latitude);
            Assert.Equal(newLongitude, identity.Longitude);
            Assert.Equal(newAboutMe, identity.AboutMe);
        }
    }
}