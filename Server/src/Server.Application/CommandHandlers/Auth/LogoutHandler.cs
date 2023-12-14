using MediatR;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Auth;

public sealed record RemoveRefreshTokenCommand(string RefreshToken) : IRequest;

public class RemoveRefreshTokenHandler : IRequestHandler<RemoveRefreshTokenCommand>
{
    private readonly IIdentityRepository _identityRepository;
    private readonly ISecurityTokenService _securityTokenService;


    public RemoveRefreshTokenHandler(IIdentityRepository identityRepository)
    {
        _identityRepository = identityRepository;
    }

    public Task Handle(RemoveRefreshTokenCommand request, CancellationToken cancellationToken)
    {
        
    }
}