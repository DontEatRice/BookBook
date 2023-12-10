using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface IAuthorRepository
{
    Task AddAsync(Author author, CancellationToken cancellationToken);
    Task<Author?> FirstOrDefaultByIdAsync(Guid guid, CancellationToken cancellationToken);
    Task<List<Author>> ListByIdsAsync(List<Guid> ids, CancellationToken cancellationToken);
    Task<List<Author>> FindAllAsync(CancellationToken cancellationToken);
}