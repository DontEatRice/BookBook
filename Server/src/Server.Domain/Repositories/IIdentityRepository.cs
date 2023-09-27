using Server.Domain.Entities.Auth;

namespace Server.Domain.Repositories;

public interface IIdentityRepository
{
    void Add(Identity identity);
    Task<int> Delete(Guid id, CancellationToken cancellationToken = default);
    Task<Identity?> FirstOrDefaultByIdAsync(Guid guid, CancellationToken cancellationToken);
    Task<Identity?> FirstOrDefaultByEmailAsync(string email, CancellationToken cancellationToken);
    Task<List<Identity>> ListByIdsAsync(List<Guid> ids, CancellationToken cancellationToken);
}