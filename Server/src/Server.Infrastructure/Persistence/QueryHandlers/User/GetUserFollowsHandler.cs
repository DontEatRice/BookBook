using AutoMapper;
using MediatR;
using Server.Application.ViewModels;
using Server.Utils;

namespace Server.Infrastructure.Persistence.QueryHandlers.User;

public sealed record GetUserFollowersQuery : PaginationOptions,
    IRequest<PaginatedResponseViewModel<UserInfoViewModel>>
{
    public Guid UserId { get; set; }
}

internal sealed class GetUserFollowersHandler : IRequestHandler<GetUserFollowersQuery, PaginatedResponseViewModel<UserInfoViewModel>>
{
    private readonly BookBookDbContext _bookDbContext;
    private readonly IMapper _mapper;

    public GetUserFollowersHandler(BookBookDbContext bookDbContext, IMapper mapper)
    {
        _bookDbContext = bookDbContext;
        _mapper = mapper;
    }

    public async Task<PaginatedResponseViewModel<UserInfoViewModel>> Handle(GetUserFollowersQuery request, CancellationToken cancellationToken)
    {
        var (result, count) = await _bookDbContext.Follows
            .OrderBy(x => x.FollowerId)
            .Where(x => x.FollowedId == request.UserId)
            .Select(x => new UserInfoViewModel
            {
                UserName = x.Follower.Name ?? "",
                IsCritic = x.Follower.IsCritic,
                UserImageUrl = x.Follower.AvatarImageUrl,
                Id = x.FollowerId,
                AboutMe = x.Follower.AboutMe
            })
            .ToListWithOffsetAsync(request.PageNumber, request.PageSize, cancellationToken);
        
        return PaginatedResponseViewModel.Create(result, count, request);
    }
}