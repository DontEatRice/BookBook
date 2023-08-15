namespace Server.Application.Exceptions;

public class NotFoundException : ApplicationException
{
    public NotFoundException(string message, string errorCode) : base(message, errorCode)
    {
    }
}
