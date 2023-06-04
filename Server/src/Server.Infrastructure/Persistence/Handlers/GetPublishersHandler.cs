using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions;
using Server.Application.Queries;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.Handlers;

internal sealed class GetPublishersHandler : IQueryHandler<GetPublishers, IEnumerable<PublisherViewModel>>
{
    private readonly BookBookDbContext _dbContext;

    public GetPublishersHandler(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<PublisherViewModel>> HandleAsync(GetPublishers query)
        => await _dbContext.Publishers
            .AsNoTracking()
            .Select(x => new PublisherViewModel { Id = x.Id, Name = x.Name})
            .ToListAsync();
}