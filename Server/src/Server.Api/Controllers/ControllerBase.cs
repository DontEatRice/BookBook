using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.Utils;

namespace Server.Api.Controllers;

public class ControllerBase : Microsoft.AspNetCore.Mvc.ControllerBase
{
    protected readonly IMediator Mediator;
    private readonly ISecurityTokenService _securityTokenService;

    public ControllerBase(IMediator mediator, ISecurityTokenService securityTokenService)
    {
        Mediator = mediator;
        _securityTokenService = securityTokenService;
    }

    internal Guid RequireUserId()
    {
        var authorizationHeader = HttpContext.Request.Headers["Authorization"].ToString();
        if (!string.IsNullOrEmpty(authorizationHeader) && authorizationHeader.StartsWith("Bearer "))
        {
            string accessToken = authorizationHeader.Substring("Bearer ".Length);

            var id = _securityTokenService.GetIdentityIdFromToken(accessToken);

            if (id is not null)
            {
                return id.Value;
            }
        }

        throw new AuthenticationException("Token not valid", ApplicationErrorCodes.TokenNotValid);
    }
}