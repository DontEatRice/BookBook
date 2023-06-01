using Server.Application.Queries;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.Handlers;

internal sealed class GetBookCategoriesHandler : IQueryHandler<GetBookCategories, IEnumerable<BookCategoryViewModel>>
{
    private readonly BookBookDbContext _bookDbContext;

    public GetBookCategoriesHandler(BookBookDbContext bookBookDbContext)
    {
        _bookDbContext = bookBookDbContext;
    }

    public async Task<IEnumerable<BookCategoryViewModel>> HandleAsync(GetBookCategories query)
        => await _bookDbContext.BookCategories
        .AsNoTracking()
        .Select(x => new BookCategoryViewModel { Id = x.Id, Name = x.Name })
        .ToListAsync();
}