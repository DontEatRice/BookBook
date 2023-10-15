namespace Server.Utils;

public class AuthConstants
{
    public const string IdClaim = "identityid";
    public const string RoleClaim = "role";
    public static readonly TimeSpan AccessTokenDuration = TimeSpan.FromHours(1);
    public static readonly TimeSpan RefreshTokenDuration = TimeSpan.FromDays(30);
}