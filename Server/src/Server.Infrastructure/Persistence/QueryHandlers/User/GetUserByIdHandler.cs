using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers.User;

public sealed record GetUserByIdQuery(Guid Id) : IRequest<UserDetailViewModel?>;

internal sealed class GetUserByIdHandler : IRequestHandler<GetUserByIdQuery, UserDetailViewModel?>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetUserByIdHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public Task<UserDetailViewModel?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        return _dbContext.Identities
            .Include(x => x.Address)
            .Where(x => x.Id == request.Id)
            .ProjectTo<UserDetailViewModel>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);
    }
}