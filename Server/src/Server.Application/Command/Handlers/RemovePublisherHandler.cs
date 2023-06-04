using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;

namespace Server.Application.Command.Handlers;

public class RemovePublisherHandler
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPublisherRepository _publisherRepository;

    public RemovePublisherHandler(IUnitOfWork unitOfWork, IPublisherRepository publisherRepository)
    {
        _unitOfWork = unitOfWork;
        _publisherRepository = publisherRepository;
    }

    public async Task<bool> HandleAsync(RemovePublisher command)
    {
        var publisher = await _publisherRepository.FirstOrDefaultByIdAsync(command.Id);

        if (publisher != null)
        {
            _publisherRepository.Delete(publisher);
        }

        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}