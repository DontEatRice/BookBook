namespace Server.Application.Exceptions;

public class LogicException : ApplicationException
{
    public string? ResourceId { get; }

    public LogicException(string message, string errorCode, string? resourceId = null) : base(message, errorCode)
    {
        ResourceId = resourceId;
    }
}
