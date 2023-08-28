namespace Server.Application.Exceptions;

public class AuthenticationException : ApplicationException
{
    public AuthenticationException(string message) : base(message, "AUTHENTICATION")
    {
    }
}