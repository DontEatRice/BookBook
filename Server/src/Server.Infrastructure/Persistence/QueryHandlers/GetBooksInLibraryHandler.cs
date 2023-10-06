using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public sealed record GetBooksInLibraryQuery(Guid id) : IRequest<List<BookInLibraryViewModel>>;

internal sealed class GetBooksInLibraryHandler : IRequestHandler<GetBooksInLibraryQuery, List<BookInLibraryViewModel>>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetBooksInLibraryHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<List<BookInLibraryViewModel>> Handle(GetBooksInLibraryQuery request, CancellationToken cancellationToken)
    {
        // niestety musi być tak brzydko, ewentualnie jakoś na froncie w Zodzie
        // w BookViewModel zrobić, że Publisher i BookCategories mogą być null, bo tu ich nie potrzebujemy
        var booksInLibrary = await _dbContext.LibraryBooks
            .AsNoTracking()
            .Include(x => x.Book)
            .ThenInclude(x => x.Authors)
            .Where(x => x.LibraryId == request.id)
            .ToListAsync();

        return _mapper.Map<List<BookInLibraryViewModel>>(booksInLibrary);
    }
}
