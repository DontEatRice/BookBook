using MediatR;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.User;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Domain.Entities;
using Server.Infrastructure.Persistence.QueryHandlers.User;
using Server.Utils;
using System.Security.Claims;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    public UserController(IMediator mediator) : base(mediator)
    {

    }

    [HttpPost("toggle-observe")]
    public async Task<ActionResult> ToggleBookInUserList (ToggleBookInUsersListCommand command)
    {
        var userId = User.FindFirstValue(AuthConstants.IdClaim) ??
                     throw new AuthenticationException(
                         "User is not authenticated",
                         ApplicationErrorCodes.NotAuthenticated);

        await Mediator.Send(command with
        {
            UserId = Guid.Parse(userId)
        });

        return NoContent();
    }

    [HttpGet("user-books")]
    public async Task<ActionResult<IEnumerable<Book>>> GetUserObservedBooks()
    {
        var userId = User.FindFirstValue(AuthConstants.IdClaim) ??
                     throw new AuthenticationException(
                         "User is not authenticated",
                         ApplicationErrorCodes.NotAuthenticated);
        return Ok(await Mediator.Send(new GetUserObservedBooksQuery(Guid.Parse(userId))));
    }
}
