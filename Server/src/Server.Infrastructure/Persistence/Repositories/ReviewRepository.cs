using Microsoft.EntityFrameworkCore;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.Repositories;

internal class ReviewRepository : IReviewRepository
{
    private readonly BookBookDbContext _dbContext;

    public ReviewRepository(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(Review review, CancellationToken cancellationToken)
    {
        await _dbContext.AddAsync(review, cancellationToken);
    }

    public Task<int> Delete(Guid id, CancellationToken cancellationToken = default)
    {
        return _dbContext.Reviews
            .Where(review => review.Id == id)
            .ExecuteDeleteAsync(cancellationToken);
    }
    
    public async Task<List<Review>> FindAllByBookIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _dbContext.Reviews
            .Where(x => x.Book.Id == id)
            .Include(x => x.User)
            .ToListAsync(cancellationToken);
    }
    
    public async Task<Review?> FirstOrDefaultByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _dbContext.Reviews
            .Include(x => x.Book)
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<Review?> FirstOrDefaultByUserAndBookIdsAsync(Guid bookId, Guid userId, CancellationToken cancellationToken)
    {
        return await _dbContext.Reviews
            .Include(x => x.User)
            .Include(x => x.Book)
            .FirstOrDefaultAsync(x => x.Book.Id == bookId && x.User.Id == userId, cancellationToken);
    }
}