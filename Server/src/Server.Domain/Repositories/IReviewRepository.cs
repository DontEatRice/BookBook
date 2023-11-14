using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface IReviewRepository
{
    Task AddAsync(Review review, CancellationToken cancellationToken);
    Task<int> Delete(Guid id, CancellationToken cancellationToken = default);
    Task<Review?> FirstOrDefaultByIdAsync(Guid guid, CancellationToken cancellationToken);
}