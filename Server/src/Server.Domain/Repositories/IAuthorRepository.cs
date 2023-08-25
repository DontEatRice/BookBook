using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface IAuthorRepository
{
    Task AddAsync(Author author, CancellationToken cancellationToken);
    void Delete(Author author);
    Task<int> Delete(Guid id, CancellationToken cancellationToken = default);
    Task<Author?> FirstOrDefaultByIdAsync(Guid guid, CancellationToken cancellationToken);
    Task<List<Author>> ListByIdsAsync(List<Guid> ids, CancellationToken cancellationToken);
}