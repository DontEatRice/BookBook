using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;
using Server.Utils;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetCriticReviewsQuery(Guid BookId) : PaginationOptions, IRequest<PaginatedResponseViewModel<ReviewViewModel>>;

internal sealed class GetCriticReviewsHandler
    : IRequestHandler<GetCriticReviewsQuery, PaginatedResponseViewModel<ReviewViewModel>>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetCriticReviewsHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<PaginatedResponseViewModel<ReviewViewModel>> Handle(
        GetCriticReviewsQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.Reviews.AsNoTracking();

        query = !string.IsNullOrWhiteSpace(request.OrderByField)
            ? query.OrderBy(request.OrderByField)
            : query.OrderBy(x => x.Id);

        var (reviews, totalCount) = await query
            .Where(x => x.Book.Id == request.BookId && x.IsCriticRating)
            .Include(x => x.User)
            .ProjectTo<ReviewViewModel>(_mapper.ConfigurationProvider)
            .ToListWithOffsetAsync(request.PageNumber, request.PageSize, cancellationToken);

        var response = new PaginatedResponseViewModel<ReviewViewModel>
        {
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            Count = totalCount,
            Data = reviews,
        };

        return response;
    }
}
