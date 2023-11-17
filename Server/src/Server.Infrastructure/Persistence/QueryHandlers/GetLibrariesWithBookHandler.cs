using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetLibrariesWithBookQuery(Guid Id)
    : IRequest<List<LibraryViewModel>>;

internal class GetLibrariesWithBookHandler : IRequestHandler<GetLibrariesWithBookQuery,List<LibraryViewModel>>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetLibrariesWithBookHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<List<LibraryViewModel>> Handle(
        GetLibrariesWithBookQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.LibraryBooks.AsNoTracking();
            
        query = query.OrderBy(x => x.BookId);

        return await query
            .Include(x => x.Library)
            .ThenInclude(xd => xd.OpenHours)
            .Include(x => x.Library)
            .ThenInclude(xd => xd.Address)
            .Where(x => x.BookId == request.Id && x.Available > 0)
            .Select(x => x.Library)
            .ProjectTo<LibraryViewModel>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}