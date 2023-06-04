using Microsoft.AspNetCore.Mvc;
using Server.Application.Abstractions;
using Server.Application.Command;
using Server.Application.Queries;
using Server.Application.ViewModels;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class PublishersControllers : ControllerBase
{
    private readonly IQueryHandler<GetPublishers, IEnumerable<PublisherViewModel>> _getPublishersHandler;
    private readonly IQueryHandler<GetPublisher, PublisherViewModel> _getPublisherHandler;

    private readonly ICommandHandler<AddPublisher> _addPublisherHandler;
    private readonly ICommandHandler<RemovePublisher> _removePublisherHandler;

    public PublishersControllers(
        IQueryHandler<GetPublishers, IEnumerable<PublisherViewModel>> getPublishersHandler,
        IQueryHandler<GetPublisher, PublisherViewModel> getPublisherHandler,
        ICommandHandler<AddPublisher> addPublisherHandler,
        ICommandHandler<RemovePublisher> removePublisherHandler)
    {
        _getPublishersHandler = getPublishersHandler;
        _getPublisherHandler = getPublisherHandler;
        _addPublisherHandler = addPublisherHandler;
        _removePublisherHandler = removePublisherHandler;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PublisherViewModel>>> List()
        => Ok(await _getPublishersHandler.HandleAsync(new GetPublishers()));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PublisherViewModel>> Get(Guid id)
        => Ok(await _getPublisherHandler.HandleAsync(new GetPublisher(id)));

    [HttpPost]
    public async Task<ActionResult> Post(AddPublisher command)
    {
        var id = Guid.NewGuid();
        await _addPublisherHandler.HandleAsync(command with
        {
            Id = id
        });

        return Created($"/publishers/{id}", null);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Post(Guid id)
    {
        await _removePublisherHandler.HandleAsync(new RemovePublisher(id));
        return NoContent();
    }
}

