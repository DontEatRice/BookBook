namespace Server.Application.Exceptions;

public abstract class ApplicationException : Exception
{
    public override string Message { get; }
    public string ErrorCode { get; }

    protected ApplicationException(string message, string errorCode)
    {
        Message = message;
        ErrorCode = errorCode;
    }
}
