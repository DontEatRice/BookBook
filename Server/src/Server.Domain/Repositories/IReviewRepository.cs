using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface IReviewRepository
{
    Task AddAsync(Review review, CancellationToken cancellationToken);
    Task<Review?> FirstOrDefaultByIdAsync(Guid guid, CancellationToken cancellationToken);
    void Delete(Review review);
    void Update(Review review);
}