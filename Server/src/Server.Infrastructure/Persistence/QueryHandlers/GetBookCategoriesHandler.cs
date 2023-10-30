using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetBookCategoriesQuery(int PageSize = 10, int PageNumber = 0, string? OrderByField = null)
    : IRequest<PaginatedResponseViewModel<BookCategoryViewModel>>;

internal sealed class GetBookCategoriesHandler
    : IRequestHandler<GetBookCategoriesQuery, PaginatedResponseViewModel<BookCategoryViewModel>>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetBookCategoriesHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<PaginatedResponseViewModel<BookCategoryViewModel>> Handle(
        GetBookCategoriesQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.BookCategories.AsNoTracking();

        query = !string.IsNullOrWhiteSpace(request.OrderByField)
            ? query.OrderBy(request.OrderByField)
            : query.OrderBy(x => x.Id);

        var (bookCategories, totalCount) = await query
            .ProjectTo<BookCategoryViewModel>(_mapper.ConfigurationProvider)
            .ToListWithOffsetAsync(request.PageNumber, request.PageSize, cancellationToken);

        var response = new PaginatedResponseViewModel<BookCategoryViewModel>
        {
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            Count = totalCount,
            Data = bookCategories
        };

        return response;
    }
}