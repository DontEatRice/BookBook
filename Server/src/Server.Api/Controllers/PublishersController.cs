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

    [HttpPost("search")]
    public async Task<ActionResult<PaginatedResponseViewModel<PublisherViewModel>>> List(GetPublishersQuery request)
        => Ok(await Mediator.Send(request));

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
    
    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, UpdatePublisherCommand command)
    {
        await Mediator.Send(command with
        {
            IdPublisher = id
        });
        return Created($"/publishers/{id}", null);
    }
}

