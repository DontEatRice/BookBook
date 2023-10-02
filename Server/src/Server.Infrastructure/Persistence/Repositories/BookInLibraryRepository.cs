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
    }
}
