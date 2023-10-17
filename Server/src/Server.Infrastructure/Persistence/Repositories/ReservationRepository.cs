using Microsoft.EntityFrameworkCore;
using Server.Domain.Entities.Reservations;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.Repositories;

internal class ReservationRepository : IReservationRepository
{
    private readonly BookBookDbContext _dbContext;

    public ReservationRepository(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task AddAsync(Reservation reservation, CancellationToken cancellationToken)
    {
        await _dbContext.Reservations.AddAsync(reservation, cancellationToken);

    }

    public async Task<Reservation?> FirstOrDefaultByIdAsync(Guid reservationId, CancellationToken cancellationToken)
    {
        return await _dbContext.Reservations.FirstOrDefaultAsync(r => r.Id == reservationId, cancellationToken); 
    }

    public async Task<IList<Reservation>> ListByUserIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        return await _dbContext.Reservations.Where(r => r.UserId == userId).ToListAsync(cancellationToken);
    }
}