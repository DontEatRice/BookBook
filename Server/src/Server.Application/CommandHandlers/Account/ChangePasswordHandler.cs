using MediatR;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.DomainServices;

namespace Server.Application.CommandHandlers.Account;

public sealed record ChangePasswordCommand(Guid IdentityId, string OldPassword, string NewPassword) : IRequest;

public class ChangePasswordHandler : IRequestHandler<ChangePasswordCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityDomainService _identityDomainService;

    public ChangePasswordHandler(IIdentityDomainService identityDomainService, IUnitOfWork unitOfWork)
    {
        _identityDomainService = identityDomainService;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        await _identityDomainService.ChangePassword(request.IdentityId, request.OldPassword, request.NewPassword, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}