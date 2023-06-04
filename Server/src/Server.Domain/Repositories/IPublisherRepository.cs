using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface IPublisherRepository
{
    void Add(Publisher publisher);
    void Delete(Publisher publisher);
    Task<Publisher?> FirstOrDefaultByIdAsync(Guid guid);
}