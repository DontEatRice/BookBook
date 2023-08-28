using FluentValidation;
using MediatR;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Admin;

public sealed class AddPublisherCommandValidator : AbstractValidator<AddPublisherCommand>
{
    public AddPublisherCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(50);
    }
}

public sealed record AddPublisherCommand(Guid Id, string Name) : IRequest;

public sealed class AddPublisherHandler : IRequestHandler<AddPublisherCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPublisherRepository _publisherRepository;

    public AddPublisherHandler(IUnitOfWork unitOfWork, IPublisherRepository publisherRepository)
    {
        _unitOfWork = unitOfWork;
        _publisherRepository = publisherRepository;
    }

    public async Task Handle(AddPublisherCommand request, CancellationToken cancellationToken)
    {
        var publisher = Publisher.Create(request.Id, request.Name);

        await _publisherRepository.AddAsync(publisher, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}