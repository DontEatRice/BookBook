using MediatR;
using Server.Application.Exceptions.Types;
using Server.Application.Exceptions;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.User;

public sealed record MakeUserCriticCommand : IRequest
{
    public Guid Id { get; set; }
}

public sealed class MakeUserCriticHandler : IRequestHandler<MakeUserCriticCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityRepository _identityRepository;

    public MakeUserCriticHandler(IUnitOfWork unitOfWork, IIdentityRepository identityRepository)
    {
        _unitOfWork = unitOfWork;
        _identityRepository = identityRepository;
    }

    public async Task Handle(MakeUserCriticCommand command, CancellationToken cancellationToken)
    {
        var user = await _identityRepository.FirstOrDefaultByIdAsync(command.Id, cancellationToken) ?? 
            throw new NotFoundException("User not found", ApplicationErrorCodes.UserNotFound);

        user.IsCritic = true;

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
