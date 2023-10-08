namespace Server.Domain.Exceptions;

public class DomainException : Exception
{
    public override string Message { get; }
    public string ErrorCode { get; }

    public DomainException(string message, string errorCode)
    {
        Message = message;
        ErrorCode = errorCode;
    }
}
