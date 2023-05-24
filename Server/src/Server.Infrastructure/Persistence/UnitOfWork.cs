using Server.Application.InfrastructureInterfaces;

namespace Server.Infrastructure.Persistence;

internal sealed class UnitOfWork : IUnitOfWork
{
    private readonly BookBookDbContext _dbContext;

    public UnitOfWork(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task SaveChangesAsync()
    {
        await using var transaction = await _dbContext.Database.BeginTransactionAsync();

        await _dbContext.SaveChangesAsync();

        await transaction.CommitAsync(CancellationToken.None);
    }
}