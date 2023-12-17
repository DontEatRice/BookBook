using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;
using Server.Utils;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetBookRankingQuery(Guid? CategoryId) : PaginationOptions, IRequest<PaginatedResponseViewModel<BookInRankingViewModel>>;

internal sealed class GetBookRankingHandler : IRequestHandler<GetBookRankingQuery, PaginatedResponseViewModel<BookInRankingViewModel>>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetBookRankingHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<PaginatedResponseViewModel<BookInRankingViewModel>> Handle(
        GetBookRankingQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.Books
            .AsNoTracking();

        query = !string.IsNullOrWhiteSpace(request.OrderByField) ?
            request.OrderDirection == OrderDirection.Desc ?
            query.OrderByDescending(request.OrderByField) :
            query.OrderBy(request.OrderByField) :
            query.OrderBy(x => x.Id);

        query = query.Where(x => x.AverageRating != null);

        if(request.CategoryId.HasValue)
        {
            query = query.Where(x => x.BookCategories.Any(c => c.Id == request.CategoryId));
        }

        var (books, totalCount) = await query
            .ProjectTo<BookInRankingViewModel>(_mapper.ConfigurationProvider)
            .ToListWithOffsetAsync(request.PageNumber, request.PageSize, cancellationToken);

        var response = new PaginatedResponseViewModel<BookInRankingViewModel>
        {
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            Count = totalCount,
            Data = books
        };

        return response;
    }
}