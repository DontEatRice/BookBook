using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface ILibraryRepository
{
    void Add(Library library);
    Task DeleteAsync(Guid id);
    Task<Library?> FirstOrDefaultByIdAsync(Guid guid, CancellationToken cancellationToken);
    Task<bool> DoesLibraryExist(Guid id, CancellationToken cancellationToken);
    Task<List<Library>> ListByIdsAsync(List<Guid> ids, CancellationToken cancellationToken);
}