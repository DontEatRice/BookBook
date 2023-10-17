using Microsoft.EntityFrameworkCore;
using Server.Domain.Entities.Reservations;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.Repositories;

internal class CartRepository : ICartRepository
{
    private readonly BookBookDbContext _dbContext;

    public CartRepository(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Cart?> FirstOrDefaultByUserIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        return await _dbContext.Carts.FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);
    }

    public async Task AddAsync(Cart cart, CancellationToken cancellationToken)
    {
        await _dbContext.Carts.AddAsync(cart, cancellationToken);
    }
}