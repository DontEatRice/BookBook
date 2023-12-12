using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface IBookCategoryRepository
{
    Task AddAsync(BookCategory bookCategory, CancellationToken cancellationToken);
    Task<BookCategory?> FirstOrDefaultByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<List<BookCategory>> ListByIdsAsync(List<Guid> ids, CancellationToken cancellationToken);
    Task<List<BookCategory>> FindAllAsync (CancellationToken cancellationToken);
}