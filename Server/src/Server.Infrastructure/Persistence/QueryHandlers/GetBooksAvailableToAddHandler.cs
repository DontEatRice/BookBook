using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public sealed record GetBooksAvailableToAddQuery(Guid Id)
    : IRequest<ICollection<BookViewModel>>;

internal sealed class GetBooksAvailableToAddHandler
    : IRequestHandler<GetBooksAvailableToAddQuery, ICollection<BookViewModel>>
{
    private readonly IMapper _mapper;
    private readonly BookBookDbContext _dbContext;

    public GetBooksAvailableToAddHandler(IMapper mapper, BookBookDbContext dbContext)
    {
        _mapper = mapper;
        _dbContext = dbContext;
    }

    public async Task<ICollection<BookViewModel>> Handle(
        GetBooksAvailableToAddQuery request, CancellationToken cancellationToken)
    {
        var booksInLibrary = _dbContext.LibraryBooks
            .AsNoTracking()
            .Where(x => x.LibraryId == request.Id)
            .Select(x => x.Book.Id);

        var query = _dbContext.Books.AsNoTracking();

        // query = !string.IsNullOrWhiteSpace(request.OrderByField)
        //     ? query.OrderBy(request.OrderByField)
        //     : query.OrderBy(x => x.Id);

        return await query
            .Where(x => !booksInLibrary.Contains(x.Id))
            .ProjectTo<BookViewModel>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}