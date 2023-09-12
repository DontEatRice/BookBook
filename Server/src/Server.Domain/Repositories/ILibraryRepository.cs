﻿using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface ILibraryRepository
{
    Task AddAsync(Library library, CancellationToken cancellationToken);
    Task DeleteAsync(Guid Id);
    Task<Library?> FirstOrDefaultByIdAsync(Guid guid, CancellationToken cancellationToken);
    Task<List<Library>> ListByIdsAsync(List<Guid> ids, CancellationToken cancellationToken);
}