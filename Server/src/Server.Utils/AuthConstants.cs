namespace Server.Utils;

public class AuthConstants
{
    public const string IdClaim = "idenityid";
    public const string RoleClaim = "role";
    public static readonly TimeSpan AccessTokenDuration = TimeSpan.FromMinutes(10);
    public static readonly TimeSpan RefreshTokenDuration = TimeSpan.FromDays(30);
}