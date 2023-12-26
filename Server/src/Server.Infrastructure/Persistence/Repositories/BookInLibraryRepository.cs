using Microsoft.EntityFrameworkCore;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.Repositories
{
    internal class BookInLibraryRepository : IBookInLibraryRepository
    {
        private readonly BookBookDbContext _dbContext;
        public BookInLibraryRepository(BookBookDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddAsync(LibraryBook libraryBook, CancellationToken cancellationToken)
        {
            await _dbContext.AddAsync(libraryBook, cancellationToken);
        }

        public Task<LibraryBook?> FirstOrDefaultByLibraryAndBookAsync(Guid libraryId, Guid bookId, CancellationToken cancellationToken)
        {
            return _dbContext.LibraryBooks
                .FirstOrDefaultAsync(x => x.LibraryId == libraryId && x.BookId == bookId, cancellationToken);
        }

        public Task DeleteBookInLibraryAsync(Guid libraryId, Guid bookId, CancellationToken cancellationToken) =>
            _dbContext.LibraryBooks
                .Where(x => x.LibraryId == libraryId && x.BookId == bookId)
                .ExecuteDeleteAsync(cancellationToken);

        public Task<List<LibraryBook>> GetAllBooksInProvidedLibrary(Guid libraryId, CancellationToken cancellationToken)
        {
            return _dbContext.LibraryBooks
            .AsNoTracking()
            .Include(x => x.Book)
            .ThenInclude(x => x.Authors)
            .Where(x => x.LibraryId == libraryId)
            .ToListAsync(cancellationToken);
        }

        public Task<List<Guid>> GetBooksIdsInProvidedLibrary(Guid libraryId, CancellationToken cancellationToken)
        {
            return _dbContext.LibraryBooks
            .AsNoTracking()
            .Where(x => x.LibraryId == libraryId)
            .Select(x => x.Book.Id)
            .ToListAsync(cancellationToken);
        }
    }
}
