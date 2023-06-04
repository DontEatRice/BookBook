using Microsoft.AspNetCore.Mvc;
using Server.Application.Abstractions;

namespace Server.Api.Controllers
{
    public class PublishersControllers : ControllerBase
    {
        private readonly IQueryHandler<GetPublishers, IEnumerable<PublisherViewModel>> _getPublishersHandler;
        private readonly IQueryHandler<GetPublisher, PublisherViewModel> _getPublisherHandler;

        private readonly ICommandHandler<AddPublisher, Guid> _addPublisherHandler;
        private readonly ICommandHandler<RemovePublisher, bool> _removePublisherHandler;

        public PublishersController(
            IQueryHandler<GetPublishers, IEnumerable<PublisherViewModel>> getPublishersHandler,
            IQueryHandler<GetPublisher, PublisherViewModel> getPublisherHandler,
            ICommandHandler<AddPublisher, Guid> addPublisherHandler,
            ICommandHandler<RemovePublisher, bool> removePublisherHandler)
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
            var id = await _addPublisherHandler.HandleAsync(command);
            return Created($"/Publishers/{id}", null);
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Post(Guid id)
        {
            await _removePublisherHandler.HandleAsync(new RemovePublisher(id));
            return NoContent();
        }
    }
}
