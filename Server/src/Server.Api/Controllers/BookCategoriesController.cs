using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.Admin;
using Server.Application.ViewModels;
using Server.Infrastructure.Persistence.QueryHandlers;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class BookCategoriesController : ControllerBase
{
    public BookCategoriesController(IMediator mediator) : base(mediator)
    {
    }
    
    [HttpPost("search")]
    public async Task<ActionResult<IEnumerable<BookCategoryViewModel>>> GetAll(GetBookCategoriesQuery query)
        => Ok(await Mediator.Send(query));

    [HttpGet("{id:Guid}")]
    public async Task<ActionResult<BookCategoryViewModel>> Get(Guid id)
    {
        return Ok(await Mediator.Send(new GetBookCategoryQuery(id)));
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateBookCategoryCommand command)
    {
        await Mediator.Send(command with { Id = id });
        return NoContent();
    }

    [HttpPost]
    public async Task<ActionResult> Post(AddBookCategoryCommand command)
    {
        var id = Guid.NewGuid();
        await Mediator.Send(command with
        {
            Id = id,
        });
        return Created($"/bookCategories/{id}", null);
    }
}