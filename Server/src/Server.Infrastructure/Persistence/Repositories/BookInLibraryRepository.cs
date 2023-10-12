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
            await _dbContext.AddAsync(libraryBook);
        }

        public async Task<LibraryBook?> FirstOrDefaultByLibraryAndBookAsync(Guid libraryId, Guid bookId, CancellationToken cancellationToken)
        {
            return await _dbContext.LibraryBooks
                .FirstOrDefaultAsync(x => x.LibraryId == libraryId && x.BookId == bookId);
        }

        public async Task<List<Guid>> GetBooksIdsInProvidedLibrary(Guid libraryId, CancellationToken cancellationToken)
        {
            return await _dbContext.LibraryBooks
            .AsNoTracking()
            .Where(x => x.LibraryId == libraryId)
            .Select(x => x.Book.Id)
            .ToListAsync(cancellationToken);
        }
    }
}
