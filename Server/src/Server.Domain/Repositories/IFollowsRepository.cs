using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface IFollowsRepository
{
    void Add(Follows follow);
    Task<int> DeleteAsync(Guid followerId, Guid followedId, CancellationToken cancellationToken);
}