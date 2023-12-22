using FluentValidation;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Admin;

public sealed class UpdateAuthorCommandValidator : AbstractValidator<UpdateAuthorCommand>
{
    public UpdateAuthorCommandValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(40);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(50);
    }
}

public sealed record UpdateAuthorCommand(Guid IdAuthor, string FirstName, string LastName, 
    int BirthYear, string? Description, string? ProfilePictureUrl) : IRequest;

public sealed class UpdateAuthorHandler : IRequestHandler<UpdateAuthorCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IAuthorRepository _authorRepository;

    public UpdateAuthorHandler(IUnitOfWork unitOfWork, IAuthorRepository authorRepository)
    {
        _unitOfWork = unitOfWork;
        _authorRepository = authorRepository;
    }

    public async Task Handle(UpdateAuthorCommand request, CancellationToken cancellationToken)
    {
        var author = await _authorRepository.FirstOrDefaultByIdAsync(request.IdAuthor, cancellationToken);
        
        if (author is null)
        {
            throw new NotFoundException("Author not found", ApplicationErrorCodes.AuthorNotFound);
        }

        author.FirstName = request.FirstName;
        author.LastName = request.LastName;
        author.BirthYear = request.BirthYear;
        author.ProfilePictureUrl = request.ProfilePictureUrl;
        author.Description = request.Description;
        author.FullText = author.FirstName + " " + author.LastName;

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}