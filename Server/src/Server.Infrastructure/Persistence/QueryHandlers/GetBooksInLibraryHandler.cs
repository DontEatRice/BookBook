using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public sealed record GetBooksInLibraryQuery(Guid Id, int PageSize = 10, int PageNumber = 0, string? OrderByField = null)
    : IRequest<PaginatedResponseViewModel<BookInLibraryViewModel>>;

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
        var query = _dbContext.LibraryBooks.AsNoTracking();

        query = !string.IsNullOrWhiteSpace(request.OrderByField)
            ? query.OrderBy(request.OrderByField)
            : query.OrderBy(x => x.BookId);

        var (books, totalCount) = await query
            .Include(x => x.Book)
            .ThenInclude(x => x.Authors)
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