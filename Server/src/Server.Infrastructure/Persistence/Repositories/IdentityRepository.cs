using Microsoft.EntityFrameworkCore;
using Server.Domain.Entities.Auth;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.Repositories;

internal class IdentityRepository : IIdentityRepository
{
    private readonly BookBookDbContext _dbContext;

    public IdentityRepository(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public void Add(Identity identity)
    { 
        _dbContext.Add(identity);
    }

    public Task<int> Delete(Guid id, CancellationToken cancellationToken = default)
    {
        return _dbContext.Authors
            .Where(author => author.Id == id)
            .ExecuteDeleteAsync(cancellationToken);
    }

    public async Task<Identity?> FirstOrDefaultByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _dbContext.Identities
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<Identity?> FirstOrDefaultByEmailAsync(string email, CancellationToken cancellationToken)
    {
        return await _dbContext.Identities
            .Include(x => x.Library)
            .FirstOrDefaultAsync(x => x.Email == email, cancellationToken);
    }

    public async Task<List<Identity>> ListByIdsAsync(List<Guid> ids, CancellationToken cancellationToken)
    {
        return await _dbContext.Identities.Where(x => ids.Contains(x.Id)).ToListAsync(cancellationToken);
    }
}