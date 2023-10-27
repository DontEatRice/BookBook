using MediatR;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.Admin;
using Server.Application.ViewModels;
using Server.Infrastructure.Persistence.QueryHandlers;

namespace Server.Api.Controllers;

[ApiController]
[Route("[Controller]")]
public class BooksController : ControllerBase
{
    public BooksController(IMediator mediator) : base(mediator)
    {
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookViewModel>>> List(
        [FromQuery] string? query, 
        [FromBody] PaginationRequest request)
        => Ok(await Mediator.Send(new GetBooksQuery(query, request.Offset, request.Limit)));

    [HttpGet("{id:Guid}")]
    public async Task<ActionResult<BookViewModel>> Get(Guid id)
        => Ok(await Mediator.Send(new GetBookQuery(id)));
    
    [HttpGet("{id:Guid}/libraries")]
    public async Task<ActionResult<List<LibraryViewModel>>> GetLibraries(Guid id)
        => Ok(await Mediator.Send(new GetLibrariesWithBookQuery(id)));

    [HttpPost]
    public async Task<ActionResult> Post(AddBookCommand command)
    {
        var id = Guid.NewGuid();
        await Mediator.Send(command with
        {
            Id = id
        });

        return Created($"/books/{id}", null);
    }

    [HttpDelete("{id:Guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await Mediator.Send(new RemoveBookCommand(id));
        return NoContent();
    }
}