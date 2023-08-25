using Microsoft.EntityFrameworkCore;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.Repositories;

internal class BookCategoryRepository : IBookCategoryRepository
{
    private readonly BookBookDbContext _dbContext;
    public BookCategoryRepository(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task AddAsync(BookCategory bookCategory, CancellationToken cancellationToken)
    {
        await _dbContext.BookCategories.AddAsync(bookCategory, cancellationToken);
    }

    public void Delete(BookCategory bookCategory)
    {
        _dbContext.BookCategories.Remove(bookCategory);
    }

    public async Task<BookCategory?> FirstOrDefaultByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _dbContext.BookCategories.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<List<BookCategory>> ListByIdsAsync(List<Guid> ids, CancellationToken cancellationToken)
    {
        return await _dbContext.BookCategories.Where(x => ids.Contains(x.Id)).ToListAsync(cancellationToken);
    }
}