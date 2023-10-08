using MediatR;
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
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookCategoryViewModel>>> GetAll()
    {
        return Ok(await Mediator.Send(new GetBookCategoriesQuery()));
    }

    [HttpGet("{id:Guid}")]
    public async Task<ActionResult<BookCategoryViewModel>> Get(Guid id)
    {
        return Ok(await Mediator.Send(new GetBookCategoryQuery(id)));
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

    [HttpDelete("{id:Guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await Mediator.Send(new RemoveBookCategoryCommand(id));
        return NoContent();
    }
}