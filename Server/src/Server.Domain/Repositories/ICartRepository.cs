using Server.Domain.Entities.Reservations;

namespace Server.Domain.Repositories;

public interface ICartRepository
{
    Task<Cart?> FirstOrDefaultByUserIdAsync(Guid guid, CancellationToken cancellationToken);
    Task AddAsync(Cart cart, CancellationToken cancellationToken);
}