using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetLibrariesWithBookQuery(Guid Id) : IRequest<IEnumerable<LibraryViewModel>>;

internal class GetLibrariesWithBookHandler : IRequestHandler<GetLibrariesWithBookQuery, IEnumerable<LibraryViewModel>>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetLibrariesWithBookHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<IEnumerable<LibraryViewModel>> Handle(GetLibrariesWithBookQuery request, CancellationToken cancellationToken)
        => await _dbContext.LibraryBooks
            .AsNoTracking()
            .Include(x => x.Library).ThenInclude(xd => xd.OpenHours)
            .Include(x => x.Library).ThenInclude(xd => xd.Address)
            .Where(x => x.BookId == request.Id && x.Available > 0)
            .Select(x => x.Library)
            .Select(x => _mapper.Map<LibraryViewModel>(x))
            .ToListAsync(cancellationToken);
}