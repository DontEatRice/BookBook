namespace Server.Utils;

public class AuthConstants
{
    public const string IdClaim = "identityid";
    public const string RoleClaim = "r";
    public const string LibraryIdClaim = "libraryid";
    public static readonly TimeSpan AccessTokenDuration = TimeSpan.FromMinutes(5);
    public static readonly TimeSpan RefreshTokenDuration = TimeSpan.FromDays(30);
}