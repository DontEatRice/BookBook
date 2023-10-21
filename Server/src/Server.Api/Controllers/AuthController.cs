using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Server.Application.CommandHandlers.Auth;
using Server.Application.Exceptions;
using Server.Domain.Exceptions;
using Server.Utils;
using SameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode;
using Server.Application.Utils;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private const string RefreshTokenCookieName = "refreshToken";
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

        return Created($"/identities/{id}", id);
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login(LoginCommand command)
    {
        var tokens = await Mediator.Send(command);
        Response.Cookies.Append(RefreshTokenCookieName, tokens.RefreshToken, CreateCookieOptionsForRefreshToken());
        return Ok(tokens);
    }

    [HttpGet("refresh")]
    public async Task<ActionResult> Refresh()
    {
        if (!Request.Cookies.TryGetValue(RefreshTokenCookieName, out var refreshToken))
        {
            throw new AuthenticationException("Bad refresh token", DomainErrorCodes.InvalidRefreshToken);
        }

        var tokens = await Mediator.Send(new RefreshTokenCommand(refreshToken));
        Response.Cookies.Append(RefreshTokenCookieName, tokens.RefreshToken, CreateCookieOptionsForRefreshToken());
        return Ok(tokens);
    }

    private CookieOptions CreateCookieOptionsForRefreshToken()
    {
        // tutaj będzie problem przy deploymencie, jak będziemy mieć gdzie indziej front a gdzie indziej backend
        // bo SameSite None to wtedy trzeba dać Secure na true czyli HTTPS
        return new CookieOptions
        {
            Domain = Request.Host.Host,
            Path = "/Auth/refresh",
            HttpOnly = true,
            Secure = false,
            Expires = DateTimeOffset.Now.Add(AuthConstants.RefreshTokenDuration),
        };
    }

}