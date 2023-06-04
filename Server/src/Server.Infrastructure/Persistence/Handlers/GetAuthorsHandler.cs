using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions;
using Server.Application.Queries;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.Handlers;

internal sealed class GetAuthorsHandler : IQueryHandler<GetAuthors, IEnumerable<AuthorViewModel>>
{
    private readonly BookBookDbContext _dbContext;

    public GetAuthorsHandler(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<AuthorViewModel>> HandleAsync(GetAuthors query)
        => await _dbContext.Authors
            .AsNoTracking()
            .Select(x => new AuthorViewModel { Id = x.Id, FirstName = x.FirstName, LastName = x.LastName})
            .ToListAsync();
}