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
    public void Add(BookCategory bookCategory)
    {
        _dbContext.BookCategories.Add(bookCategory);
    }

    public void Delete(BookCategory bookCategory)
    {
        _dbContext.BookCategories.Remove(bookCategory);
    }

    public async Task<BookCategory?> FirstOrDefaultByIdAsync(Guid id)
    {
        return await _dbContext.BookCategories.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<BookCategory>> ListByIDs(List<Guid> ids)
    {
        return await _dbContext.BookCategories.Where(x => ids.Contains(x.Id)).ToListAsync();
    }
}