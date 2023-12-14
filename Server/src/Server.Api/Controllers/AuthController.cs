using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.Auth;
using Server.Application.Exceptions;
using Server.Domain.Exceptions;
using Server.Utils;
using Server.Application.Exceptions.Types;

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

    [HttpGet("logout")]
    public async Task<ActionResult> Logout()
    {
        if (!Request.Cookies.TryGetValue(RefreshTokenCookieName, out var refreshToken))
        {
            return NoContent();
        }

        var cookieOptions = CreateCookieOptionsForRefreshToken();
        cookieOptions.Expires = DateTimeOffset.MinValue;
        Response.Cookies.Append(RefreshTokenCookieName, "", cookieOptions);
        await Mediator.Send(new LogoutCommand(refreshToken));

        return NoContent();
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

    [HttpPost("employee/register")]
    public async Task<ActionResult> RegisterEmployee(RegisterEmployeeCommand command)
    {
        var userRole = User.FindFirstValue(AuthConstants.RoleClaim);
        if(userRole != "Admin")
            throw new AuthenticationException("User is not authenticated", ApplicationErrorCodes.NotAuthenticated);

        var id = Guid.NewGuid();
        await Mediator.Send(command with 
        { 
            Id = id 
        });

        return Created($"/identities/{id}", id);
    }

    private CookieOptions CreateCookieOptionsForRefreshToken()
    {
        // tutaj będzie problem przy deploymencie, jak będziemy mieć gdzie indziej front a gdzie indziej backend
        // bo SameSite None to wtedy trzeba dać Secure na true czyli HTTPS
        var path = "/Auth";
        if (!Request.Path.StartsWithSegments(path) || !Request.Path.StartsWithSegments(path.ToLower()))
        {
            var pathValue = Request.Path.Value!.ToLower();
            path = pathValue[..pathValue.IndexOf("/auth", StringComparison.Ordinal)] + path;
        }
        return new CookieOptions
        {
            Domain = Request.Host.Host,
            Path = path,
            HttpOnly = true,
            Secure = false,
            Expires = DateTimeOffset.Now.Add(AuthConstants.RefreshTokenDuration),
        };
    }

}