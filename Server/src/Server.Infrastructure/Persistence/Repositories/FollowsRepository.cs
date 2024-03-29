﻿using Microsoft.EntityFrameworkCore;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.Repositories;

internal sealed class FollowsRepository : IFollowsRepository
{
    private readonly BookBookDbContext _dbContext;

    public FollowsRepository(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public void Add(Follows follow)
    {
        _dbContext.Add(follow);
    }

    public Task<int> DeleteAsync(Guid followerId, Guid followedId, CancellationToken cancellationToken)
    {
        return _dbContext.Follows
            .Where(x => x.FollowerId == followerId && x.FollowedId == followedId)
            .ExecuteDeleteAsync(cancellationToken);
    }

    public Task<int> UserFollowersCountAsync(Guid userId, CancellationToken cancellationToken)
    {
        return _dbContext.Follows
            .Where(x => x.FollowedId == userId)
            .CountAsync(cancellationToken);
    }

    public Task<bool> DoesUserFollowUserAsync(Guid followedId, Guid followerId, CancellationToken cancellationToken)
    {
        return _dbContext.Follows
            .AnyAsync(x => x.FollowedId == followedId && x.FollowerId == followerId, cancellationToken);
    }
}