using Server.Application.Abstractions;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.Command.Handlers;

public sealed class AddPublisherHandler : ICommandHandler<AddPublisher>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPublisherRepository _publisherRepository;

    public AddPublisherHandler(IUnitOfWork unitOfWork, IPublisherRepository publisherRepository)
    {
        _unitOfWork = unitOfWork;
        _publisherRepository = publisherRepository;
    }

    public async Task HandleAsync(AddPublisher command)
    {
        var publisher = Publisher.Create(command.Id, command.Name);

        _publisherRepository.Add(publisher);

        await _unitOfWork.SaveChangesAsync();
    }
}