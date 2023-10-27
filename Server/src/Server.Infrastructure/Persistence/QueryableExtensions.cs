using Microsoft.EntityFrameworkCore;

namespace Server.Infrastructure.Persistence;

public static class QueryableExtensions
{
    public static async Task<List<TEntity>> ToListWithOffsetAsync<TEntity>(
        this IQueryable<TEntity> queryable,
        int offset,
        int limit,
        CancellationToken cancellationToken)
        where TEntity : class
    {
        if (queryable == null)
            throw new ArgumentNullException(nameof(queryable));

        if (offset < 0)
            throw new ArgumentOutOfRangeException(nameof(offset), "Offset cannot be negative.");

        if (limit <= 0)
            throw new ArgumentOutOfRangeException(nameof(limit), "Count must be greater than zero.");

        return await queryable.Skip(offset).Take(limit).ToListAsync(cancellationToken);
    }
}