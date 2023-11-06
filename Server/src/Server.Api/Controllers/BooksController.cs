using MediatR;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.Admin;
using Server.Application.ViewModels;
using Server.Infrastructure.Persistence.QueryHandlers;
using Server.Utils;
using System.Security.Claims;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class BooksController : ControllerBase
{
    public BooksController(IMediator mediator) : base(mediator)
    {
    }
    
    [HttpPost("search")]
    public async Task<ActionResult<IEnumerable<BookViewModel>>> List(GetBooksQuery request) 
        => Ok(await Mediator.Send(request));

    [HttpGet("{id:Guid}")]
    public async Task<ActionResult<BookViewModel>> Get(Guid id)
    {
        var userId = User.FindFirstValue(AuthConstants.IdClaim);

        return Ok(await Mediator.Send(new GetBookQuery(id, userId)));
    }
    
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
    
    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, UpdateBookCommand command)
    {
        await Mediator.Send(command with
        {
            IdBook = id
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