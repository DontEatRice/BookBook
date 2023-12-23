using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;
using Server.Utils;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public sealed record GetLibrariesQuery : PaginationOptions, IRequest<PaginatedResponseViewModel<LibraryViewModel>>;

internal sealed class GetLibrariesHandler
    : IRequestHandler<GetLibrariesQuery, PaginatedResponseViewModel<LibraryViewModel>>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetLibrariesHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<PaginatedResponseViewModel<LibraryViewModel>> Handle(GetLibrariesQuery request,
        CancellationToken cancellationToken)
    {
        var query = _dbContext.Libraries.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.OrderByField))
        {
            query = request.OrderDirection == OrderDirection.Asc
                ? query.OrderBy(request.OrderByField).ThenBy(x => x.Id)
                : query.OrderByDescending(request.OrderByField).ThenBy(x => x.Id);
        }
        else
        {
            query = query.OrderBy(x => x.Id);
        }

        var (libraries, totalCount) = await query
            .Include(x => x.Address)
            .Include(x => x.OpenHours)
            .ProjectTo<LibraryViewModel>(_mapper.ConfigurationProvider)
            .ToListWithOffsetAsync(request.PageNumber, request.PageSize, cancellationToken);

        var response = new PaginatedResponseViewModel<LibraryViewModel>
        {
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            Count = totalCount,
            Data = libraries
        };

        return response;
    }
}