using MediatR;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.Reservations;
using Server.Application.Utils;
using Server.Application.ViewModels;
using Server.Infrastructure.Persistence.QueryHandlers;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class CartController : ControllerBase
{
    public CartController(IMediator mediator, ISecurityTokenService securityTokenService) : base(mediator,
        securityTokenService)
    {
    }
    
    [HttpGet]
    public async Task<ActionResult<CartViewModel>> Get()
    {
        var userId = RequireUserId();
        return Ok(await Mediator.Send(new GetCartQuery(userId)));
    }

    [HttpPost]
    public async Task<ActionResult> Post(AddToCartCommand command)
    {
        var userId = RequireUserId();
        await Mediator.Send(command with
        {
            UserId = userId
        });

        return Ok();
    }

    [HttpDelete]
    public async Task<ActionResult> Delete(RemoveFromCartCommand command)
    {
        var userId = RequireUserId();
        await Mediator.Send(command with
        {
            UserId = userId
        });

        return Ok();
    }
}