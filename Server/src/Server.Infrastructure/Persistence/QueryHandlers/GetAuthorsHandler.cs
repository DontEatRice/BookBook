using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetAuthorsQuery : IRequest<IEnumerable<AuthorViewModel>>;

internal sealed class GetAuthorsHandler : IRequestHandler<GetAuthorsQuery, IEnumerable<AuthorViewModel>>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetAuthorsHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<IEnumerable<AuthorViewModel>> Handle(GetAuthorsQuery request, CancellationToken cancellationToken)
        => await _dbContext.Authors
            .AsNoTracking()
            .ProjectTo<AuthorViewModel>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
}