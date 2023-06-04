using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions;
using Server.Application.Queries;
using Server.Application.ViewModels;
using Server.Domain.Exceptions;

namespace Server.Infrastructure.Persistence.Handlers;

internal sealed class GetPublisherHandler : IQueryHandler<GetPublisher, PublisherViewModel>
{
    private readonly BookBookDbContext _dbContext;

    public GetPublisherHandler(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PublisherViewModel> HandleAsync(GetPublisher query)
    {
        var publisher = await _dbContext.Publishers
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == query.Id);

        if (publisher is not null)
        {
            return new PublisherViewModel
            {
                Id = publisher.Id,
                Name = publisher.Name
            };
        }

        throw new NotFoundException("Publisher not found");
    }
}