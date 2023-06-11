using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface IBookCategoryRepository
{
    void Add(BookCategory bookCategory);
    void Delete(BookCategory bookCategory);
    Task<BookCategory?> FirstOrDefaultByIdAsync(Guid id);
    Task<List<BookCategory>> ListByIDs(List<Guid> ids);
}