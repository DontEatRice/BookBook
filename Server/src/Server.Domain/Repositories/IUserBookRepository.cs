using Server.Domain.Entities;
using Server.Domain.Entities.User;

namespace Server.Domain.Repositories;

public interface IUserBookRepository
{
    Task<UserBook?> FirstOrDefaultByIdsAsync(Guid bookId, Guid userId, CancellationToken cancellationToken = default);
    void Add(UserBook userBook);
    Task<List<Book>> GetAllByUserId(Guid userId, CancellationToken cancellationToken = default);
    Task<int> RemoveAsync(UserBook userBook);
}
