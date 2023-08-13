using Server.Application.Exceptions.Types;

namespace Server.Application.Exceptions;

public class ThirdPartyException : Exception
{
    public ThirdPartyExceptionType Type { get; }

    public ThirdPartyException(ThirdPartyExceptionType type)
    {
        Type = type;
    }
}