using FluentValidation;
using MediatR;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers;

public sealed class AddBookCategoryCommandValidator : AbstractValidator<AddBookCategoryCommand>
{
    public AddBookCategoryCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty();
    }
}

public sealed record AddBookCategoryCommand(Guid Id, string Name) : IRequest;

public sealed class AddBookCategoryHandler : IRequestHandler<AddBookCategoryCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBookCategoryRepository _bookCategoryRepository;

    public AddBookCategoryHandler(IUnitOfWork unitOfWork, IBookCategoryRepository bookCategoryRepository)
    {
        _unitOfWork = unitOfWork;
        _bookCategoryRepository = bookCategoryRepository;
    }

    public async Task Handle(AddBookCategoryCommand request, CancellationToken cancellationToken)
    {
        var bookCategory = BookCategory.Create(request.Id, request.Name);

        await _bookCategoryRepository.AddAsync(bookCategory, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        
    }
}

