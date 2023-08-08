namespace Server.Application.Exceptions;

public class InternalException : ApplicationException
{
    public InternalException(string message) : base(message, "INTERNAL_SERVER_ERROR")
    {
    }
}