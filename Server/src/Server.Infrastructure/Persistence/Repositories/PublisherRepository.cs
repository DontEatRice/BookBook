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

    public async Task AddAsync(Publisher publisher, CancellationToken cancellationToken)
    {
        await _dbContext.AddAsync(publisher, cancellationToken);
    }

    public void Delete(Publisher publisher)
    {
        _dbContext.Remove(publisher);
    }
    
    public void Update(Publisher publisher)
    {
        _dbContext.Update(publisher);
    }

    public async Task<Publisher?> FirstOrDefaultByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _dbContext.Publishers.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }
}