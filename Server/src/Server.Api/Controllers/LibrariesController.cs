using MediatR;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers;
using Server.Application.ViewModels;
using Server.Infrastructure.Persistence.QueryHandlers;
using static Server.Application.CommandHandlers.AddBookToLibraryHandler;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class LibrariesController : ControllerBase
{
    public LibrariesController(IMediator mediator) : base(mediator)
    {
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LibraryViewModel>>> List()
        => Ok(await Mediator.Send(new GetLibrariesQuery()));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AuthorViewModel>> Get(Guid id)
    => Ok(await Mediator.Send(new GetLibraryQuery(id)));

    [HttpPost]
    public async Task<ActionResult> Post(AddLibraryCommand command)
    {
        var id = Guid.NewGuid();
        await Mediator.Send(command with
        {
            Id = id
        });

        return Created($"/libraries/{id}", null);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Post(Guid id)
    {
        await Mediator.Send(new RemoveLibraryCommand(id));
        return NoContent();
    }

    [HttpPost("{id:guid}/books")]
    public async Task<ActionResult> AddBook(Guid id, AddBookToLibraryCommand newBookInLibrary)
    {
        await Mediator.Send(newBookInLibrary with
        {
            LibraryId = id
        });

        return Ok();
    }

    [HttpGet("{id:guid}/books")]
    public async Task<ActionResult<IEnumerable<BookInLibraryViewModel>>> GetBooks(Guid id)
    {
        return Ok(await Mediator.Send(new GetBooksInLibraryQuery(id)));
    }

    [HttpGet("{id:guid}/booksToAdd")]
    public async Task<ActionResult<IEnumerable<BookViewModel>>> GetBooksToAdd(Guid id)
    {
        return Ok(await Mediator.Send(new GetBooksAvailableToAddQuery(id)));
    }
}
