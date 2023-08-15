namespace Server.Application.Exceptions;

public class AuthorizationException : ApplicationException
{
    public AuthorizationException(string message, string errorCode) : base(message, errorCode)
    {
    }
}