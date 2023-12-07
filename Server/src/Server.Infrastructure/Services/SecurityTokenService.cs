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
    string GenerateAccessToken(Identity identity);
    string GenerateRefreshToken(Guid identityId);
    Guid? GetIdentityIdFromToken(string token);
    Role? GetIdentityRoleFromRefreshToken(string token);
    (Guid?, DateTime) GetIdentityIdAndExpirationTimeFromToken(string rawToken);
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
    private readonly AuthSettings _authSettings;

    public SecurityTokenService(AuthSettings authSettings)
    {
        _securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authSettings.Key));
        _signingCredentials = new SigningCredentials(_securityKey, SecurityAlgorithms.HmacSha256);
        _authSettings = authSettings;
    }

    public string GenerateAccessToken(Identity identity)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Sub, identity.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, identity.Email),
            new(AuthConstants.NameClaim, identity.Name ?? ""),
            new(AuthConstants.IdClaim, identity.Id.ToString())
        };
        claims.AddRange(identity.Roles.Select(role => new Claim(AuthConstants.RoleClaim, role)));

        if ((identity.Roles.Contains(Role.Employee.GetDisplayName()) || identity.Roles.Contains(Role.User.GetDisplayName())) && identity.Library is not null)
        {
            claims.Add(new Claim(AuthConstants.LibraryIdClaim, identity.Library.Id.ToString()));
        }

        if (identity.Roles.Contains(Role.User.GetDisplayName()) && identity.Latitude != null)
        {
            claims.Add(new Claim(AuthConstants.Lat, identity.Latitude.ToString()));
            claims.Add(new Claim(AuthConstants.Lon, identity.Longitude.ToString()));
        }

        return GenerateToken(AuthConstants.AccessTokenDuration, claims);
    }

    public string GenerateRefreshToken(Guid identityId)
    {
        var claims = new List<Claim>
        {
            new(AuthConstants.IdClaim, identityId.ToString())
        };
        return GenerateToken(AuthConstants.RefreshTokenDuration, claims);
    }

    public (Guid?, DateTime) GetIdentityIdAndExpirationTimeFromToken(string rawToken)
    {
        var token = ReadToken(rawToken);
        var identityId = token.Claims.First(c => c.Type == AuthConstants.IdClaim).Value;
        return (Guid.Parse(identityId), token.ValidTo);
    }

    public Guid? GetIdentityIdFromToken(string token)
    {
        var claimsPrincipal = ReadAndValidateToken(token);
    
        if (claimsPrincipal == null)
        {
            return null;
        }
    
        var identityId = claimsPrincipal.Claims.ToList().First(c => c.Type == AuthConstants.IdClaim).Value;
    
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
                ClockSkew = TimeSpan.Zero,
                ValidAudience = _authSettings.Audience,
                ValidIssuer = _authSettings.Issuer
            }, out _);
    }

    public JwtSecurityToken ReadToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        return tokenHandler.ReadJwtToken(token);
    }
    
    private string GenerateToken(TimeSpan expires, IEnumerable<Claim> claims)
    {
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.Add(expires),
            SigningCredentials = _signingCredentials,
            Issuer = _authSettings.Issuer,
            Audience = _authSettings.Audience
        };
        
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        var jwt = tokenHandler.WriteToken(token);
        return jwt;
    }
}