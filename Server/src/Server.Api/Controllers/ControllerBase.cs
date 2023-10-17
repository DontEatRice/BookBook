using System.Security.Claims;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.Utils;

namespace Server.Api.Controllers;

public class ControllerBase : Microsoft.AspNetCore.Mvc.ControllerBase
{
    protected readonly IMediator Mediator;
    // priva ate readonly ISecurityTokenService _securityTokenService;

    public ControllerBase(IMediator mediator)
    {
        Mediator = mediator;
    }

    // internal Guid RequireUserId()
    // {
    //     User.FindFirstValue()
    //     var authorizationHeader = HttpContext.Request.Headers["Authorization"].ToString();
    //     if (!string.IsNullOrEmpty(authorizationHeader) && authorizationHeader.StartsWith("Bearer "))
    //     {
    //         string accessToken = authorizationHeader.Substring("Bearer ".Length);
    //
    //         var id = _securityTokenService.GetIdentityIdFromToken(accessToken);
    //
    //         if (id is not null)
    //         {
    //             return id.Value;
    //         }
    //     }
    //
    //     throw new AuthenticationException("Token not valid", ApplicationErrorCodes.TokenNotValid);
    // }
}