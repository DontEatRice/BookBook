namespace Server.Domain.Exceptions;

public static class DomainErrorCodes
{
    public const string InvalidCredentials = "INVALID_CREDENTIALS";
    public const string SessionNotExists = "SESSION_NOT_EXISTS";
    public const string IdentityExists = "IDENTITY_EXISTS";
    public const string InvalidRefreshToken = "INVALID_REFRESH_TOKEN";
}