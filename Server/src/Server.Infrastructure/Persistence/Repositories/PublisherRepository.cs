using Microsoft.EntityFrameworkCore;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.Repositories;

internal class PublisherRepository : IPublisherRepository
{
    private readonly BookBookDbContext _dbContext;

    public PublisherRepository(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public void Add(Publisher publisher)
    {
        _dbContext.Add(publisher);
    }

    public void Delete(Publisher publisher)
    {
        _dbContext.Remove(publisher);
    }

    public async Task<Publisher?> FirstOrDefaultByIdAsync(Guid id)
    {
        return await _dbContext.Publishers.FirstOrDefaultAsync(x => x.Id == id);
    }
}