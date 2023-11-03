using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;
using Server.Utils;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetAuthorsQuery : PaginationOptions, IRequest<PaginatedResponseViewModel<AuthorViewModel>>;

internal sealed class GetAuthorsHandler
    : IRequestHandler<GetAuthorsQuery, PaginatedResponseViewModel<AuthorViewModel>>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetAuthorsHandler(IMapper mapper, BookBookDbContext dbContext)
    {
        _mapper = mapper;
        _dbContext = dbContext;
    }

    public async Task<PaginatedResponseViewModel<AuthorViewModel>> Handle(
        GetAuthorsQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.Authors.AsNoTracking();

        query = !string.IsNullOrWhiteSpace(request.OrderByField)
            ? query.OrderBy(request.OrderByField)
            : query.OrderBy(x => x.Id);

        var (authors, totalCount) = await query
            .ProjectTo<AuthorViewModel>(_mapper.ConfigurationProvider)
            .ToListWithOffsetAsync(request.PageNumber, request.PageSize, cancellationToken);

        return PaginatedResponseViewModel.Create(authors, totalCount, request);
    }
}