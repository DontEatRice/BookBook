using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetLibrariesWithBookQuery(Guid Id, int PageSize = 10, int PageNumber = 0, string? OrderByField = null)
    : IRequest<PaginatedResponseViewModel<LibraryViewModel>>;

internal class GetLibrariesWithBookHandler 
    : IRequestHandler<GetLibrariesWithBookQuery, PaginatedResponseViewModel<LibraryViewModel>>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetLibrariesWithBookHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<PaginatedResponseViewModel<LibraryViewModel>> Handle(
        GetLibrariesWithBookQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.LibraryBooks.AsNoTracking();
            
        query = !string.IsNullOrWhiteSpace(request.OrderByField)
            ? query.OrderBy(request.OrderByField)
            : query.OrderBy(x => x.BookId);
            
        var (libraries, totalCount) = await query
            .Include(x => x.Library)
            .ThenInclude(xd => xd.OpenHours)
            .Include(x => x.Library)
            .ThenInclude(xd => xd.Address)
            .Where(x => x.BookId == request.Id && x.Available > 0)
            .Select(x => x.Library)
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