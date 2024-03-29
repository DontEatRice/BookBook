using MediatR;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.Admin;
using Server.Application.ViewModels;
using Server.Infrastructure.Persistence.QueryHandlers;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthorsController : ControllerBase
{
    public AuthorsController(IMediator mediator) : base(mediator)
    {
    }

    [HttpPost("search")]
    public async Task<ActionResult<PaginatedResponseViewModel<AuthorViewModel>>> List(GetAuthorsQuery query)
        => Ok(await Mediator.Send(query));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AuthorViewModel>> Get(Guid id)
        => Ok(await Mediator.Send(new GetAuthorQuery(id)));

    [HttpPost]
    public async Task<ActionResult> Post(AddAuthorCommand command)
    {
        var id = Guid.NewGuid();
        await Mediator.Send(command with
        {
            Id = id
        });

        return Created($"/authors/{id}", null);
    }
    
    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, UpdateAuthorCommand command)
    {
        await Mediator.Send(command with
        {
            IdAuthor = id
        });
        return Created($"/authors/{id}", null);
    }

    [HttpGet("{id:Guid}/book-cards")]
    public async Task<ActionResult<IEnumerable<BookViewModel>>> GetAuthorsBookCards (Guid id)
    {
        return Ok(await Mediator.Send(new GetAuthorBookCardsQuery(id)));
    }
}