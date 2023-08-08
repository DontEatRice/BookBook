namespace Server.Application.Exceptions;

public class LogicException : ApplicationException
{
    public LogicException(string message, string errorCode) : base(message, errorCode)
    {
    }
}
