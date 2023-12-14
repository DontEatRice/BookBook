namespace Server.Utils;

public class AuthConstants
{
    public const string IdClaim = "identityid";
    public const string RoleClaim = "r";
    public const string NameClaim = "_name";
    public const string LibraryIdClaim = "libraryid";
    public const string Lat = "lat";
    public const string Lon = "lon";
    public static readonly TimeSpan AccessTokenDuration = TimeSpan.FromMinutes(2);
    public static readonly TimeSpan RefreshTokenDuration = TimeSpan.FromDays(30);
}