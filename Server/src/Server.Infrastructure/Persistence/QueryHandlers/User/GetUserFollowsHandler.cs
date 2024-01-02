using MediatR;
using Server.Application.ViewModels;
using Server.Utils;

namespace Server.Infrastructure.Persistence.QueryHandlers.User;

public sealed record GetUserFollowsQuery : PaginationOptions,
    IRequest<PaginatedResponseViewModel<UserInfoViewModel>>
{
    public Guid UserId { get; set; }
}

internal sealed class GetUserFollowsHandler : IRequestHandler<GetUserFollowsQuery, PaginatedResponseViewModel<UserInfoViewModel>>
{
    private readonly BookBookDbContext _bookDbContext;

    public GetUserFollowsHandler(BookBookDbContext bookDbContext)
    {
        _bookDbContext = bookDbContext;
    }

    public async Task<PaginatedResponseViewModel<UserInfoViewModel>> Handle(GetUserFollowsQuery request, CancellationToken cancellationToken)
    {
        var (result, count) = await _bookDbContext.Follows
            .OrderBy(x => x.FollowerId)
            .Where(x => x.FollowerId == request.UserId)
            .Select(x => new UserInfoViewModel
            {
                UserName = x.Followed.Name ?? "",
                IsCritic = x.Followed.IsCritic,
                UserImageUrl = x.Followed.AvatarImageUrl,
                Id = x.FollowedId,
                AboutMe = x.Followed.AboutMe
            })
            .ToListWithOffsetAsync(request.PageNumber, request.PageSize, cancellationToken);
        
        return PaginatedResponseViewModel.Create(result, count, request);
    }
}