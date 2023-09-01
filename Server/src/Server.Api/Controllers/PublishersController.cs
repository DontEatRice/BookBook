using MediatR;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.Admin;
using Server.Application.ViewModels;
using Server.Infrastructure.Persistence.QueryHandlers;

namespace Server.Api.Controllers;

[ApiController]
[Route("[Controller]")]
public class PublishersController : ControllerBase
{
    public PublishersController(IMediator mediator) : base(mediator)
    {
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PublisherViewModel>>> List()
        => Ok(await Mediator.Send(new GetPublishersQuery()));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PublisherViewModel>> Get(Guid id)
        => Ok(await Mediator.Send(new GetPublisherQuery(id)));

    [HttpPost]
    public async Task<ActionResult> Post(AddPublisherCommand command)
    {
        var id = Guid.NewGuid();
        await Mediator.Send(command with
        {
            Id = id
        });

        return Created($"/publishers/{id}", null);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Post(Guid id)
    {
        await Mediator.Send(new RemovePublisherCommand(id));
        return NoContent();
    }
}

