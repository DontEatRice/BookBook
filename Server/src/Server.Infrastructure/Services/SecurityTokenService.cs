using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Extensions;
using Server.Domain.Entities.Auth;
using Server.Infrastructure.Persistence.Settings;
using Server.Utils;

namespace Server.Infrastructure.Services;

public interface ISecurityTokenService
{
    string GenerateAccessToken(Guid identityId, string email, Role role = Role.User);
    string GenerateRefreshToken(Guid identityId, string email, Role role = Role.User);
    Guid? GetIdentityIdFromRefreshToken(string token);
    Role? GetIdentityRoleFromRefreshToken(string token);
}

public enum SecurityTokenType
{
    AccessToken,
    RefreshToken,
}

internal class SecurityTokenService : ISecurityTokenService
{
    private readonly SecurityKey _securityKey;
    private readonly SigningCredentials _signingCredentials;

    public SecurityTokenService(AuthSettings authSettings)
    {
        _securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authSettings.Key));
        _signingCredentials = new SigningCredentials(_securityKey, SecurityAlgorithms.HmacSha256);
    }

    public string GenerateAccessToken(Guid identityId, string email, Role role = Role.User)
    {
        return GenerateToken(identityId, email, AuthConstants.AccessTokenDuration, role);
    }

    public string GenerateRefreshToken(Guid identityId, string email, Role role = Role.User)
    {
        return GenerateToken(identityId, email, AuthConstants.RefreshTokenDuration, role);
    }

    public Guid? GetIdentityIdFromRefreshToken(string token)
    {
        var claimsPrincipal = ReadAndValidateToken(token);
    
        if (claimsPrincipal == null)
        {
            return null;
        }
    
        var claimsArray = claimsPrincipal.Claims.ToArray();
        var isTokenTypeCorrect = claimsArray
            .FirstOrDefault(ca => ca.Type == JwtRegisteredClaimNames.Typ)?
            .Value == SecurityTokenType.RefreshToken.GetDisplayName();
    
        if (!isTokenTypeCorrect)
        {
            return null;
        }
    
        var identityId = claimsPrincipal.Claims.ToList().First(c => c.Value == AuthConstants.IdClaim).Value;
    
        return Guid.Parse(identityId);
    }
    
    public Role? GetIdentityRoleFromRefreshToken(string token)
    {
        var claimsPrincipal = ReadAndValidateToken(token);
        if (claimsPrincipal == null)
        {
            return null;
        }
    
        var claimsArray = claimsPrincipal.Claims.ToArray();
        var isTokenTypeCorrect = claimsArray
            .FirstOrDefault(ca => ca.Type == AuthConstants.RoleClaim)?
            .Value == SecurityTokenType.RefreshToken.ToString();
        
        var roleValue = claimsPrincipal.Claims.FirstOrDefault(ca => ca.Type == AuthConstants.RoleClaim)?.Value;
    
        if (!isTokenTypeCorrect || roleValue == null || !Enum.TryParse<Role>(roleValue, out var role))
        {
            return null;
        }
    
        return role;
    }
    
    private ClaimsPrincipal? ReadAndValidateToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
    
        return tokenHandler.ValidateToken(token,
            new TokenValidationParameters
            {
                IssuerSigningKey = _securityKey,
                ValidateIssuerSigningKey = true,
                ValidateIssuer = true,
                ValidateAudience = true,
                ClockSkew = TimeSpan.Zero
            }, out _);
    }
    
    private string GenerateToken(Guid identityId, string email, TimeSpan expires,  Role role = Role.User)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Typ, SecurityTokenType.RefreshToken.GetDisplayName()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Sub, identityId.ToString()),
            new(JwtRegisteredClaimNames.Email, email),
            new(AuthConstants.IdClaim, identityId.ToString()),
            new(AuthConstants.RoleClaim, role.ToString())
        };
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow + AuthConstants.RefreshTokenDuration,
            SigningCredentials = _signingCredentials
        };
        
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        var jwt = tokenHandler.WriteToken(token);
        return jwt;
    }
}