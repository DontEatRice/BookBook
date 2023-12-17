using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface IPublisherRepository
{
    Task AddAsync(Publisher publisher, CancellationToken cancellationToken);
    Task<Publisher?> FirstOrDefaultByIdAsync(Guid guid, CancellationToken cancellationToken);
}