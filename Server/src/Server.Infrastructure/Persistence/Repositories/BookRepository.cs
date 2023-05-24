using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.Repositories;

internal sealed class BookRepository : IBookRepository
{
    private readonly BookBookDbContext _dbContext;

    public BookRepository(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(Book book)
    {
        await _dbContext.AddAsync(book);

        await _dbContext.SaveChangesAsync();
    }
}