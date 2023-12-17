using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;
using Server.Utils;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetBooksQuery(string? Query, Guid? AuthorId, Guid? CategoryId, int? YearPublished, Guid? LibraryId) : PaginationOptions, IRequest<PaginatedResponseViewModel<BookViewModel>>;

internal sealed class GetBooksHandler : IRequestHandler<GetBooksQuery, PaginatedResponseViewModel<BookViewModel>>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetBooksHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<PaginatedResponseViewModel<BookViewModel>> Handle(
        GetBooksQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.Books
            .AsNoTracking();
        
        query = !string.IsNullOrWhiteSpace(request.OrderByField) ? 
            request.OrderDirection == OrderDirection.Desc ?
            query.OrderByDescending(request.OrderByField) : 
            query.OrderBy(request.OrderByField) :
            query.OrderBy(x => x.Id);

        if (!string.IsNullOrWhiteSpace(request.Query))
        {
            var fullTextQuery = "\"" + request.Query + "\"";
            query = query.Where(x => EF.Functions.FreeText(x.FullText, $"{fullTextQuery}"));
        }
        
        if (request.AuthorId.HasValue)
        {
            query = query.Where(x => x.Authors.Any(a => a.Id == request.AuthorId));
        }
        
        if (request.CategoryId.HasValue)
        {
            query = query.Where(x => x.BookCategories.Any(a => a.Id == request.CategoryId));
        }
        
        if (request is{ YearPublished: > 0})
        {
            query = query.Where(x => x.YearPublished.ToString().Contains(request.YearPublished.Value.ToString()));
        }

        if (request.LibraryId.HasValue)
        {
            var libraryBooks = _dbContext.LibraryBooks
                .Where(x => x.LibraryId == request.LibraryId)
                .Select(x => x.BookId);
            query = query.Where(b => libraryBooks.Contains(b.Id));
        }
        
        var (books, totalCount) = await query
            .ProjectTo<BookViewModel>(_mapper.ConfigurationProvider)
            .ToListWithOffsetAsync(request.PageNumber, request.PageSize, cancellationToken);

        var response = new PaginatedResponseViewModel<BookViewModel>
        {
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            Count = totalCount,
            Data = books
        };

        return response;
    }
}