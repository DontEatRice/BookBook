namespace Server.Infrastructure.Configuration;

public enum ExceptionFilterType
{
    Authentication = 1,
    Authorization,
    NotFound,
    ThirdParty,
    Logic,
    Validation,
    Internal,
    Unexpected
}