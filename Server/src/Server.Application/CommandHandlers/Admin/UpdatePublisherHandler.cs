using FluentValidation;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Admin;

public sealed class UpdatePublisherCommandValidator : AbstractValidator<UpdatePublisherCommand>
{
    public UpdatePublisherCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(50);
    }
}

public sealed record UpdatePublisherCommand(Guid IdPublisher, string Name, string? Description) : IRequest;

public sealed class UpdatePublisherHandler : IRequestHandler<UpdatePublisherCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPublisherRepository _publisherRepository;

    public UpdatePublisherHandler(IUnitOfWork unitOfWork, IPublisherRepository publisherRepository)
    {
        _unitOfWork = unitOfWork;
        _publisherRepository = publisherRepository;
    }

    public async Task Handle(UpdatePublisherCommand request, CancellationToken cancellationToken)
    {
        var publisher = await _publisherRepository.FirstOrDefaultByIdAsync(request.IdPublisher, cancellationToken);
        
        if (publisher is null)
        {
            throw new NotFoundException("Publisher not found", ApplicationErrorCodes.PublisherNotFound);
        }

        publisher.Name = request.Name;
        publisher.Description = request.Description;

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}