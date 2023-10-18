using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface IBookRepository
{
    Task AddAsync(Book book, CancellationToken cancellationToken);
    void Delete(Book book);
    Task<Book?> FirstOrDefaultByIdAsync(Guid guid, CancellationToken cancellationToken);
    Task<List<Book>> FindAsync(CancellationToken cancellationToken, string? query = null);
    Task<Book?> FirstOrDefaultByISBNAsync(string isbn, CancellationToken cancellationToken);
}