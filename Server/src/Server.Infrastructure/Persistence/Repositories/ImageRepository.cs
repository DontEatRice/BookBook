using Microsoft.EntityFrameworkCore;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.Repositories;

internal class ImageRepository : IImageRepository
{
    private readonly BookBookDbContext _dbContext;

    public ImageRepository(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public void Add(Image image)
    {
        _dbContext.Images.Add(image);
    }

    public Task<Image?> FindById(Guid id, CancellationToken cancellationToken)
    {
        return _dbContext.Images.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public Task<int> Remove(Guid id)
    {
        return _dbContext.Images
            .Where(x => x.Id == id)
            .ExecuteDeleteAsync();
    }
}