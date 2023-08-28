namespace Server.Application.Exceptions;

public class AuthenticationException : ApplicationException
{
    public AuthenticationException(string message, string errorCode) : base(message, errorCode)
    {
    }
}