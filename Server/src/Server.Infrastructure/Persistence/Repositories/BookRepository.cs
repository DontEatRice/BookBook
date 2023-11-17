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

    public async Task AddAsync(Book book, CancellationToken cancellationToken)
    {
        await _dbContext.AddAsync(book, cancellationToken);
    }
    
    public Task<int> Delete(Guid id, CancellationToken cancellationToken = default)
    {
        return _dbContext.Books
            .Where(book => book.Id == id)
            .ExecuteDeleteAsync(cancellationToken);
    }

    public async Task<List<Book>> FindAllAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.Books
            .Include(x => x.Authors)
            .Include(x => x.BookCategories)
            .Include(x => x.Publisher)
            .ToListAsync(cancellationToken);
    }

    public async Task<Book?> FirstOrDefaultByISBNAsync(string isbn, CancellationToken cancellationToken)
    {
        return await _dbContext.Books.FirstOrDefaultAsync(b => b.ISBN == isbn, cancellationToken);
    }

    public async Task<Book?> FirstOrDefaultByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _dbContext.Books
            .Include(x => x.Authors)
            .Include(x => x.BookCategories)
            .Include(x => x.Publisher)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<List<Book>> FindAsync(string? query, CancellationToken cancellationToken)
    {
        if (query == null || query == "")
        {
            return await _dbContext.Books
                .Include(x => x.Authors)
                .Include(x => x.BookCategories)
                .Include(x => x.Publisher)
                .ToListAsync(cancellationToken);
        }

        return await _dbContext.Books
                .Include(x => x.Authors)
                .Include(x => x.BookCategories)
                .Include(x => x.Publisher)
                .Where(x => EF.Functions.FreeText(x.FullText, $"{query}"))
                .ToListAsync(cancellationToken);
    }
}