using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;
using Server.Utils;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public sealed record GetBooksInLibraryQuery(Guid Id)
    : PaginationOptions, IRequest<PaginatedResponseViewModel<BookInLibraryViewModel>>;

internal sealed class GetBooksInLibraryHandler
    : IRequestHandler<GetBooksInLibraryQuery, PaginatedResponseViewModel<BookInLibraryViewModel>>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetBooksInLibraryHandler(IMapper mapper, BookBookDbContext dbContext)
    {
        _mapper = mapper;
        _dbContext = dbContext;
    }

    public async Task<PaginatedResponseViewModel<BookInLibraryViewModel>> Handle(
        GetBooksInLibraryQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.LibraryBooks
            .Include(x => x.Book)
            .ThenInclude(x => x.Authors)
            .AsNoTracking()
            .AsSingleQuery();

        if (!string.IsNullOrWhiteSpace(request.OrderByField))
        {
            if(request.OrderByField == "book")
            {
                query = request.OrderDirection == OrderDirection.Asc
                ? query.OrderBy(x => x.Book.Title)
                : query.OrderByDescending(x => x.Book.Title);
            }
            else
            {
                query = request.OrderDirection == OrderDirection.Asc
                ? query.OrderBy(request.OrderByField)
                : query.OrderByDescending(request.OrderByField);
            }
        }

        

        var (books, totalCount) = await query
            .Where(x => x.LibraryId == request.Id)
            .ProjectTo<BookInLibraryViewModel>(_mapper.ConfigurationProvider)
            .ToListWithOffsetAsync(request.PageNumber, request.PageSize, cancellationToken);

        var response = new PaginatedResponseViewModel<BookInLibraryViewModel>
        {
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            Count = totalCount,
            Data = books
        };

        return response;
    }
}