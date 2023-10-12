﻿using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface IBookInLibraryRepository
{
    Task AddAsync(LibraryBook libraryBook, CancellationToken cancellationToken);
    Task<LibraryBook?> FirstOrDefaultByLibraryAndBookAsync(Guid libraryId, Guid bookId, CancellationToken cancellationToken);
    Task<List<Guid>> GetBooksIdsInProvidedLibrary(Guid libraryId, CancellationToken cancellationToken);
}
