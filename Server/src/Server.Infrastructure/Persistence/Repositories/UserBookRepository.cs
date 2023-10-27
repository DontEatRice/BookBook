using Microsoft.EntityFrameworkCore;
using Server.Domain.Entities;
using Server.Domain.Entities.User;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.Repositories;

internal sealed class UserBookRepository : IUserBookRepository
{
    private readonly BookBookDbContext _dbContext;

    public UserBookRepository(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public void Add(UserBook userBook)
    {
        _dbContext.Add(userBook);
    }

    public async Task<UserBook?> FirstOrDefaultByIdsAsync(Guid bookId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.UserBooks.FirstOrDefaultAsync(x => x.UserId == userId && x.BookId == bookId, cancellationToken);
    }

    public async Task<List<Book>> GetAllByUserId(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.UserBooks
            .Include(x => x.Book)
            .ThenInclude(x => x.Publisher)
            .Include(x => x.Book)
            .ThenInclude(x => x.BookCategories)
            .Include(x => x.Book)
            .ThenInclude(x => x.Authors)
            .Where(x => x.UserId == userId)
            .Select(x => x.Book)
            .ToListAsync(cancellationToken);
    }

    public Task<int> RemoveAsync(UserBook userBook)
    {
       return _dbContext.UserBooks.Where(x => x.UserId == userBook.UserId && x.BookId == userBook.BookId).ExecuteDeleteAsync();
    }
}
