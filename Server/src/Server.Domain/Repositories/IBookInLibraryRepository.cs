using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface IBookInLibraryRepository
{
    Task AddAsync(LibraryBook libraryBook, CancellationToken cancellationToken);
}
