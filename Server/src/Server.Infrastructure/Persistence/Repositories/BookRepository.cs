using Microsoft.EntityFrameworkCore;
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

    public void Add(Book book)
    {
        _dbContext.AddAsync(book);
    }

    public void Delete(Book book)
    {
        _dbContext.Remove(book);
    }

    public async Task<Book?> FirstOrDefaultByIdAsync(Guid id)
    {
        return await _dbContext.Books.FirstOrDefaultAsync(x => x.Id == id);
    }
}