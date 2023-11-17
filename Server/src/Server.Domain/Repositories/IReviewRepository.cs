using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface IReviewRepository
{
    Task AddAsync(Review review, CancellationToken cancellationToken);
    
    Task<int> Delete(Guid id, CancellationToken cancellationToken = default);
    Task<List<Review>> FindAllByBookIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Review?> FirstOrDefaultByIdAsync(Guid id, CancellationToken cancellationToken);
}