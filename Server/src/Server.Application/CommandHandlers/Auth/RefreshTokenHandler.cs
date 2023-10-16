using MediatR;
using Server.Application.Exceptions;
using Server.Application.InfrastructureInterfaces;
using Server.Application.ViewModels;
using Server.Domain.DomainServices;
using Server.Domain.Exceptions;

namespace Server.Application.CommandHandlers.Auth;

public sealed record RefreshTokenCommand(string RefreshToken) : IRequest<AuthViewModel>;

public class RefreshTokenHandler : IRequestHandler<RefreshTokenCommand, AuthViewModel>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityDomainService _identityDomainService;

    public RefreshTokenHandler(IUnitOfWork unitOfWork, IIdentityDomainService identityDomainService)
    {
        _unitOfWork = unitOfWork;
        _identityDomainService = identityDomainService;
    }

    public async Task<AuthViewModel> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        string accessToken, refreshToken;
        try
        {
            (accessToken, refreshToken) =
                await _identityDomainService.RefreshAccessTokenAsync(request.RefreshToken, cancellationToken);
        }
        catch (DomainException exception)
        {
            throw new AuthenticationException(exception.Message, exception.ErrorCode);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new AuthViewModel {AccessToken = accessToken, RefreshToken = refreshToken};
    }
}