using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions;
using Server.Application.Queries;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.Handlers;

internal sealed class GetBooksHandler : IQueryHandler<GetBooks, IEnumerable<BookViewModel>>
{
    private readonly BookBookDbContext _dbContext;

    public GetBooksHandler(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<BookViewModel>> HandleAsync(GetBooks query)
        => await _dbContext.Books
            .AsNoTracking()
            .Select(x => new BookViewModel { Id = x.Id, Name = x.Name })
            .ToListAsync();
}