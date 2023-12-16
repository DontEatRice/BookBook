using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.Admin;
using Server.Application.CommandHandlers.User;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Utils;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ReviewsController : ControllerBase
{
    public ReviewsController(IMediator mediator) : base(mediator)
    {
    }
    
    [HttpPost]
    [Authorize]
    public async Task<ActionResult> Post(AddReviewCommand command)
    {
        var userId = GetUserIdOrThrow();
        
        var id = Guid.NewGuid();
        await Mediator.Send(command with
        {
            Id = id,
            UserId = userId
        });

        return Created($"/reviews/{id}", null);
    }
    
    [HttpPut]
    [Authorize]
    public async Task<ActionResult> Update(UpdateReviewCommand command)
    {
        var userId = GetUserIdOrThrow();
        
        await Mediator.Send(command with
        {
            UserId = userId
        });

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await Mediator.Send(new RemoveReviewCommand(id));
        return NoContent();
    }
}