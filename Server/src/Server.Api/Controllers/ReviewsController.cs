using MediatR;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.Admin;
using Server.Application.ViewModels;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ReviewsController : ControllerBase
{
    public ReviewsController(IMediator mediator) : base(mediator)
    {
    }
    
    [HttpPost]
    public async Task<ActionResult> Post(AddReviewCommand command)
    {
        var id = Guid.NewGuid();
        await Mediator.Send(command with
        {
            Id = id
        });

        return Created($"/reviews/{id}", null);
    }
    
    [HttpPut]
    public async Task<ActionResult> Update(UpdateReviewCommand command)
    {
        await Mediator.Send(command);

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Post(Guid id)
    {
        await Mediator.Send(new RemoveReviewCommand(id));
        return NoContent();
    }
}