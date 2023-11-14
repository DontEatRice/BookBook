using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface IBookRepository
{
    Task AddAsync(Book book, CancellationToken cancellationToken);
    Task<int> Delete(Guid id, CancellationToken cancellationToken = default);
    Task<Book?> FirstOrDefaultByIdAsync(Guid guid, CancellationToken cancellationToken);
    Task<List<Book>> FindAllAsync(CancellationToken cancellationToken);
    Task<Book?> FirstOrDefaultByISBNAsync(string isbn, CancellationToken cancellationToken);
    Task<List<Book>> FindAsync(string? query, CancellationToken cancellationToken);
}