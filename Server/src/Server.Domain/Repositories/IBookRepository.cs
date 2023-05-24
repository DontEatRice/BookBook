using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface IBookRepository
{
    Task AddAsync(Book book);
}