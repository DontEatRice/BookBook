using Server.Domain.Entities;

namespace Server.Domain.Repositories;

public interface IImageRepository
{
    void Add(Image image);
    Task<Image?> FindById(Guid id, CancellationToken cancellationToken);
    Task<int> Remove(Guid id);
}