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

    public void Delete(Review review)
    {
        _dbContext.Remove(review);
    }
    
    public void Update(Review review)
    {
        _dbContext.Update(review);
    }
    
    public async Task<Review?> FirstOrDefaultByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _dbContext.Reviews
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }
}