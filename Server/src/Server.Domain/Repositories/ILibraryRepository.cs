using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface ILibraryRepository
{
    void Add(Library library);
    Task<bool> DoesLibraryExist(Guid id, CancellationToken cancellationToken);
    Task<int> Delete(Guid id, CancellationToken cancellationToken = default);
    Task<Library?> FirstOrDefaultByIdAsync(Guid guid, CancellationToken cancellationToken);
    Task<Library?> FirstOrDefaultWithDetailsByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<List<Library>> ListByIdsAsync(List<Guid> ids, CancellationToken cancellationToken);
}