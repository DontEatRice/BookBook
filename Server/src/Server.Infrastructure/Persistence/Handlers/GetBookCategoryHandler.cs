using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions;
using Server.Application.Queries;
using Server.Application.ViewModels;
using Server.Domain.Exceptions;

namespace Server.Infrastructure.Persistence.Handlers;

internal sealed class GetBookCategoryHandler : IQueryHandler<GetBookCategory, BookCategoryViewModel>
{
    private readonly BookBookDbContext _dbContext;

    public GetBookCategoryHandler(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<BookCategoryViewModel> HandleAsync(GetBookCategory query)
    {
        var bookCategory = await _dbContext.BookCategories
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == query.Id);

        if (bookCategory is not null)
        {
            return new BookCategoryViewModel
            {
                Id = bookCategory.Id,
                Name = bookCategory.Name
            };
        }

        throw new NotFoundException("Book category not found");
    }
}
