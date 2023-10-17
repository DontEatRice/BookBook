using MediatR;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.Auth;
using Server.Application.Utils;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    public AuthController(IMediator mediator) : base(mediator)
    {
    }
    
    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterCommand command)
    {
        var id = Guid.NewGuid();
        await Mediator.Send(command with
        {
            Id = id
        });

        return Created($"/identities/{id}", null);
    }
    
    [HttpPost("login")]
    public async Task<ActionResult> Login(LoginCommand command)
        => Ok(await Mediator.Send(command));
}