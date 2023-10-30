using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public sealed record GetBooksAvailableToAddQuery(Guid Id, int PageSize = 10, int PageNumber = 0,
        string? OrderByField = null)
    : IRequest<PaginatedResponseViewModel<BookViewModel>>;

internal sealed class GetBooksAvailableToAddHandler
    : IRequestHandler<GetBooksAvailableToAddQuery, PaginatedResponseViewModel<BookViewModel>>
{
    private readonly IMapper _mapper;
    private readonly BookBookDbContext _dbContext;

    public GetBooksAvailableToAddHandler(IMapper mapper, BookBookDbContext dbContext)
    {
        _mapper = mapper;
        _dbContext = dbContext;
    }

    public async Task<PaginatedResponseViewModel<BookViewModel>> Handle(
        GetBooksAvailableToAddQuery request, CancellationToken cancellationToken)
    {
        var booksInLibrary = _dbContext.LibraryBooks
            .AsNoTracking()
            .Where(x => x.LibraryId == request.Id)
            .Select(x => x.Book.Id);

        var query = _dbContext.Books.AsNoTracking();

        query = !string.IsNullOrWhiteSpace(request.OrderByField)
            ? query.OrderBy(request.OrderByField)
            : query.OrderBy(x => x.Id);

        var (books, totalCount) = await query
            .Where(x => !booksInLibrary.Contains(x.Id))
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