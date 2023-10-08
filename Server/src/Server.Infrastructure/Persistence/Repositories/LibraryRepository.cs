using Microsoft.EntityFrameworkCore;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.Repositories;

internal class LibraryRepository : ILibraryRepository
{
    private readonly BookBookDbContext _dbContext;

    public LibraryRepository(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(Library library, CancellationToken cancellationToken)
    {
        await _dbContext.AddAsync(library, cancellationToken);
    }

    public async Task DeleteAsync(Guid id)
    {
        await _dbContext.Libraries.Where(x => x.Id == id).ExecuteDeleteAsync();
    }

    public async Task<Library?> FirstOrDefaultByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _dbContext.Libraries.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<List<Library>> ListByIdsAsync(List<Guid> ids, CancellationToken cancellationToken)
    {
        return await _dbContext.Libraries.Where(x => ids.Contains(x.Id)).ToListAsync(cancellationToken);
    }
}