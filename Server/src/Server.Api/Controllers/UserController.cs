using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.User;
using Server.Infrastructure.Persistence.QueryHandlers.User;
using Server.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Server.Utils;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    public UserController(IMediator mediator) : base(mediator)
    {
    }

    [Authorize("User")]
    [HttpPost("toggle-observe")]
    public async Task<ActionResult> ToggleBookInUserList(ToggleBookInUsersListCommand command)
    {
        await Mediator.Send(command with
        {
            UserId = GetUserIdOrThrow()
        });

        return NoContent();
    }

    [Authorize]
    [HttpPost("user-books")]
    public async Task<ActionResult<PaginatedResponseViewModel<BookViewModel>>> GetUserObservedBooks()
    {
        var userId = GetUserIdOrThrow();
        return Ok(await Mediator.Send(new GetUserObservedBooksQuery(userId)));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserProfileViewModel>> GetUserProfile(Guid id)
    {
        Guid? visitorId = null;
        if (Guid.TryParse(User.FindFirstValue(AuthConstants.IdClaim), out var parsed))
        {
            visitorId = parsed;
        }
        return Ok(await Mediator.Send(new GetUserProfileQuery(id, visitorId)));
    }

    [HttpPost("{id:guid}/reviews")]
    public async Task<ActionResult<PaginatedResponseViewModel<ReviewInUserProfile>>> GetUserReviews(Guid id, GetUserReviewsQuery query)
    {
        return Ok(await Mediator.Send(query with
        {
            Id = id
        }));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<PaginatedResponseViewModel<AdminUserViewModel>>> GetUsers(GetUsersQuery query)
    {
        return Ok(await Mediator.Send(query));
    }

    [Authorize]
    [HttpPatch("{id:guid}/make-critic")]
    public async Task<ActionResult> MakeUserCritic(Guid id)
    {
        await Mediator.Send(new MakeUserCriticCommand
        {
            Id = id
        });
        return NoContent();
    }

    [HttpPost("{id:guid}/followers")]
    public async Task<ActionResult> GetUserFollowers(Guid id)
    {
        // TODO dokończyć
    }

    [Authorize("User")]
    [HttpPost("{id:guid}/follow")]
    public async Task<ActionResult> FollowUser(Guid id)
    {
        var followerId = GetUserIdOrThrow();
        await Mediator.Send(new FollowUserCommand
        {
            FollowerId = followerId,
            FollowedId = id
        });

        return NoContent();
    }

    [Authorize("User")]
    [HttpPost("{id:guid}/unfollow")]
    public async Task<ActionResult> UnfollowUser(Guid id)
    {
        var followerId = GetUserIdOrThrow();
        await Mediator.Send(new UnfollowUserCommand
        {
            FollowerId = followerId,
            FollowedId = id
        });
        return NoContent();
    }
}
