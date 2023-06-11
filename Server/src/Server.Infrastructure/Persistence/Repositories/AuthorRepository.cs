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

    public void Add(Author author)
    {
        _dbContext.Add(author);
    }

    public void Delete(Author author)
    {
        _dbContext.Remove(author);
    }

    public async Task<Author?> FirstOrDefaultByIdAsync(Guid id)
    {
        return await _dbContext.Authors.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<Author>> ListByIDs(List<Guid> ids)
    {
        return await _dbContext.Authors.Where(x => ids.Contains(x.Id)).ToListAsync();
    }
}