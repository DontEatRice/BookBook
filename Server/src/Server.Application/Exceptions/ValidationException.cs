using Server.Application.Exceptions.Types;
#pragma warning disable CS8618

namespace Server.Application.Exceptions;

public class ValidationError
{
    public string? PropertyName { get; init; }
    public string ErrorMessage { get; init; }
}

public class ValidationException : ApplicationException
{
    public IEnumerable<ValidationError> Errors { get; }

    public ValidationException(IEnumerable<ValidationError> errors)
        : base("Validation Error Occured", ApplicationErrorCodes.ValidationError)
    {
        Errors = errors;
    }
}