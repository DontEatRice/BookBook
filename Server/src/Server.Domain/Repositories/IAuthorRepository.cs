using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface IAuthorRepository
{
    void Add(Author author);
    void Delete(Author author);
    Task<Author?> FirstOrDefaultByIdAsync(Guid guid);
}