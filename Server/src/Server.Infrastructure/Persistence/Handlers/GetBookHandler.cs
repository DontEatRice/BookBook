using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions;
using Server.Application.Queries;
using Server.Application.ViewModels;
using Server.Domain.Exceptions;

namespace Server.Infrastructure.Persistence.Handlers
{
    internal sealed class GetBookHandler : IQueryHandler<GetBook, BookViewModel>
    {
        private readonly BookBookDbContext _dbContext;

        public GetBookHandler(BookBookDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<BookViewModel> HandleAsync(GetBook query)
        {
            var book = await _dbContext.Books
                .AsNoTracking()
                .Include(x => x.Publisher)
                .Include(x => x.BookCategories)
                .Include(x => x.Authors)
                .FirstOrDefaultAsync(x => x.Id == query.Id);

            if (book is not null)
            {
                return new BookViewModel
                {
                    Id = book.Id,
                    ISBN = book.ISBN,
                    Title = book.Title,
                    YearPublished = book.YearPublished,
                    CoverLink = book.CoverLink,
                    AverageRating = book.AverageRating,
                    AverageCriticRating = book.AverageCriticRating,
                    Publisher = new PublisherViewModel
                    {
                        Id = book.Publisher.Id,
                        Name = book.Publisher.Name
                    },
                    Authors = book.Authors.Select(x => new AuthorViewModel
                    {
                        Id = x.Id,
                        FirstName = x.FirstName,
                        LastName = x.LastName
                    }).ToList(),
                    BookCategories = book.BookCategories.Select(x => new BookCategoryViewModel
                    {
                        Id = x.Id,
                        Name = x.Name
                    }).ToList()
                };
            }

            throw new NotFoundException("Book not found");
        }
    }
}