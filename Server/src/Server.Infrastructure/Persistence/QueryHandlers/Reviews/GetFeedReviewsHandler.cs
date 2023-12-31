using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Server.Application.ViewModels;
using Server.Utils;

namespace Server.Infrastructure.Persistence.QueryHandlers.Reviews;

public sealed record GetFeedReviewsCommand(Guid UserId) : PaginationOptions, IRequest<PaginatedResponseViewModel<ReviewWithBookViewModel>>;

internal sealed class GetFeedReviewsHandler : IRequestHandler<GetFeedReviewsCommand, PaginatedResponseViewModel<ReviewWithBookViewModel>>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetFeedReviewsHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<PaginatedResponseViewModel<ReviewWithBookViewModel>> Handle(GetFeedReviewsCommand request, CancellationToken cancellationToken)
    {
        var whoUserFollows = _dbContext.Follows.Where(x => x.FollowerId == request.UserId).Select(x => x.FollowedId);

        var (reviews, count) = await _dbContext.Reviews
            .Where(x => whoUserFollows.Contains(x.UserId))
            .OrderByDescending(x => x.Created)
            .ProjectTo<ReviewWithBookViewModel>(_mapper.ConfigurationProvider)
            .ToListWithOffsetAsync(request.PageNumber, request.PageSize, cancellationToken);
        
        return PaginatedResponseViewModel.Create(reviews, count, request);
    }
}