using Microsoft.EntityFrameworkCore;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.Repositories;

internal class AuthorRepository : IAuthorRepository
{
    private readonly BookBookDbContext _dbContext;

    public AuthorRepository(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(Author author, CancellationToken cancellationToken)
    {
        await _dbContext.AddAsync(author, cancellationToken);
    }

    public async Task<List<Author>> FindAllAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.Authors.ToListAsync(cancellationToken);
    }

    public async Task<Author?> FirstOrDefaultByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _dbContext.Authors.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<List<Author>> ListByIdsAsync(List<Guid> ids, CancellationToken cancellationToken)
    {
        return await _dbContext.Authors.Where(x => ids.Contains(x.Id)).ToListAsync(cancellationToken);
    }
}