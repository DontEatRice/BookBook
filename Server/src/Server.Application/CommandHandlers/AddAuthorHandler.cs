using FluentValidation;
using MediatR;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers;

//TODO Add validators for other commands and queries 
public sealed class AddBookHandlerValidator : AbstractValidator<AddAuthorCommand>
{
    public AddBookHandlerValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(40);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(50);
    }
}

public sealed record AddAuthorCommand(Guid Id, string FirstName, string LastName, int BirthYear) : IRequest;

public sealed class AddAuthorHandler : IRequestHandler<AddAuthorCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IAuthorRepository _authorRepository;

    public AddAuthorHandler(IUnitOfWork unitOfWork, IAuthorRepository authorRepository)
    {
        _unitOfWork = unitOfWork;
        _authorRepository = authorRepository;
    }

    public async Task Handle(AddAuthorCommand request, CancellationToken cancellationToken)
    {
        var author = Author.Create(request.Id, request.FirstName, request.LastName, request.BirthYear);

        await _authorRepository.AddAsync(author, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}