using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface IBookRepository
{
    void Add(Book book);

    void Delete(Book book);

    Task<Book?> FirstOrDefaultByIdAsync(Guid guid);
}