using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface ILibraryRepository
{
    void Add(Library library);
    Task<int> Delete(Guid id, CancellationToken cancellationToken = default);
    Task<Library?> FirstOrDefaultByIdAsync(Guid guid, CancellationToken cancellationToken);
    Task<List<Library>> ListByIdsAsync(List<Guid> ids, CancellationToken cancellationToken);
}