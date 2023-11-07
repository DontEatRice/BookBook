using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface ILibraryRepository
{
    void Add(Library library);
    Task DeleteAsync(Guid Id);
    void Update(Library library);
    Task<Library?> FirstOrDefaultByIdAsync(Guid guid, CancellationToken cancellationToken);
    Task<List<Library>> ListByIdsAsync(List<Guid> ids, CancellationToken cancellationToken);
}