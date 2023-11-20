using MediatR;
using Server.Domain.Entities.Auth;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.QueryHandlers.User;

public sealed record GetUserByIdQuery(Guid Id) : IRequest<Identity?>;

internal sealed class GetUserByIdHandler : IRequestHandler<GetUserByIdQuery, Identity?>
{
    private readonly IIdentityRepository _identityRepository;

    public GetUserByIdHandler(IIdentityRepository identityRepository)
    {
        _identityRepository = identityRepository;
    }

    public Task<Identity?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        return _identityRepository.FirstOrDefaultByIdAsync(request.Id, cancellationToken);
    }
}