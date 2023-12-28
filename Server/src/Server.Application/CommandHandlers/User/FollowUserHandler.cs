using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.User;

public sealed record FollowUserCommand : IRequest
{
    public Guid FollowerId { get; set; }
    public Guid FollowedId { get; set; }
}

public sealed class FollowUserHandler : IRequestHandler<FollowUserCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityRepository _identityRepository;
    private readonly IFollowsRepository _followsRepository;

    public FollowUserHandler(IIdentityRepository identityRepository, IUnitOfWork unitOfWork, IFollowsRepository followsRepository)
    {
        _identityRepository = identityRepository;
        _unitOfWork = unitOfWork;
        _followsRepository = followsRepository;
    }

    public async Task Handle(FollowUserCommand request, CancellationToken cancellationToken)
    {
        if (!await _identityRepository.IdentityByIdExistsAsync(request.FollowedId, cancellationToken))
        {
            throw new NotFoundException("User not found", ApplicationErrorCodes.UserNotFound);
        }

        var follows = Follows.Create(follower: request.FollowerId, followed: request.FollowedId);
        
        _followsRepository.Add(follows);
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}