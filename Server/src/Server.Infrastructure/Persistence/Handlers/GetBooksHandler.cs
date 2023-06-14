using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions;
using Server.Application.Queries;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.Handlers;

internal sealed class GetBooksHandler : IQueryHandler<GetBooks, IEnumerable<BookViewModel>>
{
    private readonly BookBookDbContext _dbContext;

    public GetBooksHandler(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<BookViewModel>> HandleAsync(GetBooks query)
        => await _dbContext.Books
            .AsNoTracking()
            .Include(x => x.Publisher)
            .Include(x => x.BookCategories)
            .Include(x => x.Authors)
            .Select(x => new BookViewModel
            {
                Id = x.Id,
                Title = x.Title,
                ISBN = x.ISBN,
                YearPublished = x.YearPublished,
                CoverLink = x.CoverLink,
                AverageRating = x.AverageRating,
                AverageCriticRating = x.AverageCriticRating,
                Publisher = new PublisherViewModel
                {
                    Id = x.Publisher.Id,
                    Name = x.Publisher.Name
                },
                Authors = x.Authors.Select(a => new AuthorViewModel
                {
                    Id = a.Id,
                    FirstName = a.FirstName,
                    LastName = a.LastName
                }).ToList(),
                BookCategories = x.BookCategories.Select(b => new BookCategoryViewModel
                {
                    Id = b.Id,
                    Name = b.Name
                }).ToList()
            })
            .ToListAsync();
}