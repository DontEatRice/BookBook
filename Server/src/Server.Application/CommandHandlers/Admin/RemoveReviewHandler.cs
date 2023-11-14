using MediatR;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Admin;

public sealed record RemoveReviewCommand(Guid Id) : IRequest;

public sealed class RemoveReviewHandler : IRequestHandler<RemoveReviewCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IReviewRepository _reviewRepository;

    public RemoveReviewHandler(IUnitOfWork unitOfWork, IReviewRepository reviewRepository)
    {
        _unitOfWork = unitOfWork;
        _reviewRepository = reviewRepository;
    }

    public async Task Handle(RemoveReviewCommand request, CancellationToken cancellationToken)
    {
        await _reviewRepository.Delete(request.Id, cancellationToken);
    }
}