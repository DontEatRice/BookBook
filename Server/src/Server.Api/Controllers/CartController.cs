using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.Reservations;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.Utils;
using Server.Application.ViewModels;
using Server.Infrastructure.Persistence.QueryHandlers;
using Server.Infrastructure.Persistence.QueryHandlers.Reservations;
using Server.Utils;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class CartController : ControllerBase
{
    public CartController(IMediator mediator) : base(mediator)
    {
    }
    
    [HttpGet]
    public async Task<ActionResult<CartViewModel>> Get()
    {
        var userId = User.FindFirstValue(AuthConstants.IdClaim) ??
                     throw new AuthenticationException(
                         "User is not authenticated",
                         ApplicationErrorCodes.NotAuthenticated);
        
        return Ok(await Mediator.Send(new GetCartQuery(Guid.Parse(userId))));
    }

    [HttpPost]
    public async Task<ActionResult> Post(AddToCartCommand command)
    {
        var userId = User.FindFirstValue(AuthConstants.IdClaim) ??
                     throw new AuthenticationException(
                         "User is not authenticated",
                         ApplicationErrorCodes.NotAuthenticated);
        
        await Mediator.Send(command with
        {
            UserId = Guid.Parse(userId)
        });

        return Ok();
    }

    [HttpDelete]
    public async Task<ActionResult> Delete(RemoveFromCartCommand command)
    {
        var userId = User.FindFirstValue(AuthConstants.IdClaim) ??
                     throw new AuthenticationException(
                         "User is not authenticated",
                         ApplicationErrorCodes.NotAuthenticated);
        
        await Mediator.Send(command with
        {
            UserId = Guid.Parse(userId)
        });

        return Ok();
    }
}