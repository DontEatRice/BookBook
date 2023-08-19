using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetPublishersQuery : IRequest<IEnumerable<PublisherViewModel>>;

internal sealed class GetPublishersHandler : IRequestHandler<GetPublishersQuery, IEnumerable<PublisherViewModel>>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetPublishersHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<IEnumerable<PublisherViewModel>> Handle(
        GetPublishersQuery request,
        CancellationToken cancellationToken)
        => await _dbContext.Publishers
            .AsNoTracking()
            .Select(x => _mapper.Map<PublisherViewModel>(x))
            .ToListAsync(cancellationToken);
}