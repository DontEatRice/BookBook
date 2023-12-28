using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface IFollowsRepository
{
    void Add(Follows follow);
    Task<int> DeleteAsync(Guid followerId, Guid followedId, CancellationToken cancellationToken);
    Task<int> UserFollowersCountAsync(Guid userId, CancellationToken cancellationToken);
    Task<bool> DoesUserFollowUserAsync(Guid followedId, Guid followerId, CancellationToken cancellationToken);
}