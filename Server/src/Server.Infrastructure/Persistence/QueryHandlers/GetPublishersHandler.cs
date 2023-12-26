using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;
using Server.Utils;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetPublishersQuery : PaginationOptions, IRequest<PaginatedResponseViewModel<PublisherViewModel>>;

internal sealed class GetPublishersHandler
    : IRequestHandler<GetPublishersQuery, PaginatedResponseViewModel<PublisherViewModel>>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetPublishersHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<PaginatedResponseViewModel<PublisherViewModel>> Handle(
        GetPublishersQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.Publishers.AsNoTracking();

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

        var (publishers, totalCount) = await query
            .ProjectTo<PublisherViewModel>(_mapper.ConfigurationProvider)
            .ToListWithOffsetAsync(request.PageNumber, request.PageSize, cancellationToken);

        var response = new PaginatedResponseViewModel<PublisherViewModel>
        {
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            Count = totalCount,
            Data = publishers
        };

        return response;
    }
}