using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.Account;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class AccountController : ControllerBase
{
    public AccountController(IMediator mediator) : base(mediator) 
    {}

    [HttpPatch("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordCommand command)
    {
        var id = GetUserIdOrThrow();
        await Mediator.Send(command with { IdentityId = id });
        return NoContent();
    }
}