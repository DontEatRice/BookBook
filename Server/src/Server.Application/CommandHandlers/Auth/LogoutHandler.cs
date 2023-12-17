using MediatR;
using Microsoft.Extensions.Logging;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.DomainServices;
using Server.Domain.Exceptions;

namespace Server.Application.CommandHandlers.Auth;

public sealed record LogoutCommand(string RefreshToken) : IRequest;

public class LogoutHandler : IRequestHandler<LogoutCommand>
{
    private readonly IIdentityDomainService _identityDomainService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<LogoutHandler> _logger;

    public LogoutHandler(IIdentityDomainService identityDomainService, IUnitOfWork unitOfWork, ILogger<LogoutHandler> logger)
    {
        _identityDomainService = identityDomainService;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        try
        {
            await _identityDomainService.LogoutAsync(request.RefreshToken, cancellationToken);
        }
        catch (DomainException exception)
        {
            _logger.LogWarning("{Name} occured. Message: {Msg}", nameof(DomainException), exception.Message);
        }
        finally
        {
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}