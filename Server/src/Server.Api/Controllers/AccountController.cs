using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.Account;
using Server.Application.CommandHandlers.User;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.ViewModels;
using Server.Infrastructure.Persistence.QueryHandlers.User;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class AccountController : ControllerBase
{
    public AccountController(IMediator mediator) : base(mediator)
    { }

    [HttpPatch("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordCommand command)
    {
        var id = GetUserIdOrThrow();
        await Mediator.Send(command with { IdentityId = id });
        return NoContent();
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var id = GetUserIdOrThrow();
        var user = await Mediator.Send(new GetUserByIdQuery(id)) ??
            throw new NotFoundException("User not found", ApplicationErrorCodes.UserNotFound);
        return Ok(user);
    }

    [HttpPatch("me")]
    public async Task<IActionResult> UpdateProfile(UpdateUserProfileCommand command)
    {
        var id = GetUserIdOrThrow();
        return Ok(await Mediator.Send(command with { Id = id }));
    }
}