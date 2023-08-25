using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetPublisherQuery(Guid Id) : IRequest<PublisherViewModel>;

internal sealed class GetPublisherHandler : IRequestHandler<GetPublisherQuery, PublisherViewModel>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetPublisherHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<PublisherViewModel> Handle(GetPublisherQuery request, CancellationToken cancellationToken)
    {
        var publisher = await _dbContext.Publishers
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (publisher is null)
        {
            throw new NotFoundException("Publisher not found", ApplicationErrorCodes.PublisherNotFound);

        }
        
        return _mapper.Map<PublisherViewModel>(publisher);
    }
}