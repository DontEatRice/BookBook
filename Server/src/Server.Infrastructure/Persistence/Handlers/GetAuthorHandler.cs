using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions;
using Server.Application.Queries;
using Server.Application.ViewModels;
using Server.Domain.Exceptions;

namespace Server.Infrastructure.Persistence.Handlers;

internal sealed class GertAuthorHandler : IQueryHandler<GetAuthor, AuthorViewModel>
{
    private readonly BookBookDbContext _dbContext;

    public GertAuthorHandler(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<AuthorViewModel> HandleAsync(GetAuthor query)
    {
        var author = await _dbContext.Authors
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == query.Id);

        if (author is not null)
        {
            return new AuthorViewModel
            {
                Id = author.Id,
                FirstName = author.FirstName, 
                LastName = author.LastName
            };
        }

        throw new NotFoundException("Author not found");
    }
}