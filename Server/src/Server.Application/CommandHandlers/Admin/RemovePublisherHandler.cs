using MediatR;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Admin;

public sealed record RemovePublisherCommand(Guid Id) : IRequest;

public sealed class RemovePublisherHandler : IRequestHandler<RemovePublisherCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPublisherRepository _publisherRepository;

    public RemovePublisherHandler(IUnitOfWork unitOfWork, IPublisherRepository publisherRepository)
    {
        _unitOfWork = unitOfWork;
        _publisherRepository = publisherRepository;
    }

    public async Task Handle(RemovePublisherCommand request, CancellationToken cancellationToken)
    {
        await _publisherRepository.Delete(request.Id, cancellationToken);
    }
}