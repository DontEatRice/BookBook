using Server.Domain.Entities.Reservations;

namespace Server.Domain.Repositories;

public interface IReservationRepository
{
    Task AddAsync(Reservation reservation, CancellationToken cancellationToken);
    
    Task<Reservation?> FirstOrDefaultByIdAsync(Guid requestReservationId, CancellationToken cancellationToken);
    Task<IList<Reservation>> ListByUserIdAsync(Guid userId, CancellationToken cancellationToken);
}