using MediatR;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.User;

public sealed record UnfollowUserCommand : IRequest
{
    public Guid FollowerId { get; set; }
    public Guid FollowedId { get; set; }
}

public sealed class UnfollowUserHandler : IRequestHandler<UnfollowUserCommand>
{
    private readonly IFollowsRepository _followsRepository;

    public UnfollowUserHandler(IFollowsRepository followsRepository)
    {
        _followsRepository = followsRepository;
    }

    public Task Handle(UnfollowUserCommand request, CancellationToken cancellationToken) =>
        _followsRepository.DeleteAsync(
            followerId: request.FollowerId,
            followedId: request.FollowedId,
            cancellationToken
        );
}