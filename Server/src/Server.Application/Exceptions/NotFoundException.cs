namespace Server.Application.Exceptions;

public class NotFoundException : ApplicationException
{
    public string? ResourceId { get; }
    
    public NotFoundException(string message, string errorCode, string? resourceId = null) : base(message, errorCode)
    {
        ResourceId = resourceId;
    }
}
