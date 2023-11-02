using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.Reservations;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Infrastructure.Persistence.QueryHandlers.Reservations;
using Server.Utils;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ReservationsController : ControllerBase
{
    public ReservationsController(IMediator mediator) : base(mediator)
    {
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult> Post(MakeReservationCommand command)
    {
        var id = Guid.NewGuid();
        var userId = User.FindFirstValue(AuthConstants.IdClaim) ??
                     throw new AuthenticationException(
                         "User is not authenticated",
                         ApplicationErrorCodes.NotAuthenticated);

        await Mediator.Send(command with
        {
            UserId = Guid.Parse(userId),
            ReservationId = id
        });

        return Created($"/reservations/{id}", null);
    }
    
    [Authorize]
    [HttpPost("{id:guid}/cancel")]
    public async Task<ActionResult> Cancel(CancelReservationCommand command)
    {
        await Mediator.Send(command);

        return Ok();
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult> Get()
    {
        var userId = User.FindFirstValue(AuthConstants.IdClaim) ??
                     throw new AuthenticationException(
                         "User is not authenticated",
                         ApplicationErrorCodes.NotAuthenticated);

        return Ok(await Mediator.Send(new ListUserReservationsQuery(Guid.Parse(userId))));
    }

    // Admin

    [Authorize]
    [HttpPost("admin/{id:guid}/cancel")]
    public async Task<ActionResult> CancelByAdmin(CancelReservationByAdminCommand command)
    {
        await Mediator.Send(command);

        return Ok();
    }
    
    [Authorize]
    [HttpPost("admin/{id:guid}/give-out")]
    public async Task<ActionResult> GiveOut(GiveOutReservationCommand command)
    {
        await Mediator.Send(command);

        return Ok();
    }

    [Authorize]
    [HttpPost("admin/{id:guid}/return")]
    public async Task<ActionResult> Return(ReturnReservationCommand command)
    {
        await Mediator.Send(command);

        return Ok();
    }

    [Authorize]
    [HttpPost("admin")]
    public async Task<ActionResult> List(ListReservationsQuery query)
        => Ok(await Mediator.Send(query));
}