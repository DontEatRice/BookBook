using Server.Domain.Entities.Auth;

namespace Server.Application.Utils;

public interface ISecurityTokenService
{
    string GenerateAccessToken(Guid identityId, string email, Role role = Role.User);
    string GenerateRefreshToken(Guid identityId, string email, Role role = Role.User);
    Guid? GetIdentityIdFromToken(string token);
    Role? GetIdentityRoleFromToken(string token);
}