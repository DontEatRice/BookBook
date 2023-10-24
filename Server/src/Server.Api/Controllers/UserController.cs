using MediatR;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.User;
using Server.Domain.Entities;
using Server.Infrastructure.Persistence.QueryHandlers.User;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    public UserController(IMediator mediator) : base(mediator)
    {

    }

    [HttpGet("{id:Guid}/does-observe")]
    public async Task<ActionResult<DoesUserObserveBook>> DoesUserObserveBook(Guid id, DoesUserObserveBookQuery query)
    {
        return Ok(await Mediator.Send(query with
        {
            UserId = id
        }));
    }

    [HttpPost("{id:Guid}/toggle-observe")]
    public async Task<ActionResult> ToggleBookInUserList (Guid id, ToggleBookInUsersListCommand command)
    {
        await Mediator.Send(command with
        {
            UserId = id
        });

        return NoContent();
    }

    [HttpGet("{id:Guid}/user-books")]
    public async Task<ActionResult<IEnumerable<Book>>> GetUserObservedBooks(Guid id)
    {
        return Ok(await Mediator.Send(new GetUserObservedBooksQuery(id)));
    }
}
