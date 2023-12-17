using MediatR;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.Admin;
using Server.Application.ViewModels;
using Server.Infrastructure.Persistence.QueryHandlers;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class LibrariesController : ControllerBase
{
    public LibrariesController(IMediator mediator) : base(mediator)
    {
    }

    [HttpPost("search")]
    public async Task<ActionResult<PaginatedResponseViewModel<LibraryViewModel>>> List(GetLibrariesQuery request)
        => Ok(await Mediator.Send(request));

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
    
    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, UpdateLibraryCommand command)
    {
        await Mediator.Send(command with
        {
            IdLibrary = id
        });
        return Created($"/libraries/{id}", null);
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

    [HttpPost("{id:guid}/books/search")]
    public async Task<ActionResult<IEnumerable<BookInLibraryViewModel>>> GetBooks(Guid id, GetBooksInLibraryQuery query)
    {
        return Ok(await Mediator.Send(query with
        {
            Id = id
        }));
    }

    [HttpGet("{id:guid}/not-added")]
    public async Task<ActionResult<IEnumerable<BookViewModel>>> GetBooksToAdd(Guid id)
    {
        return Ok(await Mediator.Send(new GetBooksAvailableToAddQuery(id)));
    }
}