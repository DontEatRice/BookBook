using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.Admin;
using Server.Application.CommandHandlers.User;
using Server.Infrastructure.Persistence.QueryHandlers.Reviews;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize("User")]
public class ReviewsController : ControllerBase
{
    public ReviewsController(IMediator mediator) : base(mediator)
    {
    }
    
    [HttpPost]
    public async Task<ActionResult> Post(AddReviewCommand command)
    {
        var userId = GetUserIdOrThrow();
        
        var id = Guid.NewGuid();
        await Mediator.Send(command with
        {
            Id = id,
            UserId = userId
        });

        return Ok();
    }
    
    [HttpPut]
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
        var userId = GetUserIdOrThrow();
        await Mediator.Send(new RemoveReviewCommand(id, userId));
        return NoContent();
    }

    [HttpPost("feed/search")]
    public async Task<ActionResult> FeedSearch(GetFeedReviewsCommand command)
    {
        var userId = GetUserIdOrThrow();
        return Ok(await Mediator.Send(command with { UserId = userId }));
    }
}