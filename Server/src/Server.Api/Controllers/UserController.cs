using MediatR;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.User;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Domain.Entities;
using Server.Infrastructure.Persistence.QueryHandlers.User;
using AutoMapper;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly IMapper _mapper;
    public UserController(IMediator mediator, IMapper mapper) : base(mediator)
    {
        _mapper = mapper;
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> UserDetail(Guid id)
    {
        var user = await Mediator.Send(new GetUserByIdQuery(id)) ??
            throw new NotFoundException("User not found", ApplicationErrorCodes.UserNotFound);

        return Ok(user);
    }

    [HttpPost("toggle-observe")]
    public async Task<ActionResult> ToggleBookInUserList(ToggleBookInUsersListCommand command)
    {
        await Mediator.Send(command with
        {
            UserId = GetUserIdOrThrow()
        });

        return NoContent();
    }
    

    [HttpGet("user-books")]
    public async Task<ActionResult<IEnumerable<Book>>> GetUserObservedBooks()
    {
        var userId = GetUserIdOrThrow();
        return Ok(await Mediator.Send(new GetUserObservedBooksQuery(userId)));
    }
}
