using System.Security.Claims;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Utils;

namespace Server.Api.Controllers;

public class ControllerBase : Microsoft.AspNetCore.Mvc.ControllerBase
{
    protected readonly IMediator Mediator;
    
    public ControllerBase(IMediator mediator)
    {
        Mediator = mediator;
    }

    protected Guid GetUserIdOrThrow()
    {
        var rawId = User.FindFirstValue(AuthConstants.IdClaim) ??
            throw new AuthenticationException("User is not authenticated", ApplicationErrorCodes.NotAuthenticated);
        return Guid.Parse(rawId);
    } 
}