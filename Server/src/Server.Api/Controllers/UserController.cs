using MediatR;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.User;
using Server.Infrastructure.Persistence.QueryHandlers.User;
using Server.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    public UserController(IMediator mediator) : base(mediator)
    {
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
        return Ok(await Mediator.Send(new GetUserProfileQuery(id)));
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
        var userId = GetUserIdOrThrow();
        return Ok(await Mediator.Send(query));
    }

    [Authorize]
    [HttpPatch("{id:guid}/make-critic")]
    public async Task<ActionResult> MakeUserCritic(Guid id)
    {
        var userId = GetUserIdOrThrow();
        await Mediator.Send(new MakeUserCriticCommand
        {
            Id = id
        });
        return NoContent();
    }


}
