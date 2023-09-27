using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public sealed record GetLibrariesQuery : IRequest<IEnumerable<LibraryViewModel>>;
internal sealed class GetLibrariesHandler : IRequestHandler<GetLibrariesQuery, IEnumerable<LibraryViewModel>>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetLibrariesHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<IEnumerable<LibraryViewModel>> Handle(GetLibrariesQuery request, CancellationToken cancellationToken)
        => await _dbContext.Libraries
        .AsNoTracking()
        .Include(x => x.Address)
        .Include(x => x.OpenHours)
        .Select(x => _mapper.Map<LibraryViewModel>(x))
        .ToListAsync(cancellationToken);
}
