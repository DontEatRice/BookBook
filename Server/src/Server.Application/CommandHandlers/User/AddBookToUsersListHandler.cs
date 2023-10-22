using FluentValidation;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;
using System.Text.Json.Serialization;

namespace Server.Application.CommandHandlers.User;

public sealed class ToggleBookInUsersListHandlerValidator : AbstractValidator<ToggleBookInUsersListCommand>
{
    public ToggleBookInUsersListHandlerValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
    }
}

public sealed record ToggleBookInUsersListCommand : IRequest
{
    [JsonIgnore]
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
}

public sealed class ToggleBookInUsersListHandler : IRequestHandler<ToggleBookInUsersListCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityRepository _identityRepository;
    private readonly IBookRepository _bookRepository;

    public ToggleBookInUsersListHandler(IUnitOfWork unitOfWork, IIdentityRepository identityRepository, IBookRepository bookRepository)
    {
        _unitOfWork = unitOfWork;
        _identityRepository = identityRepository;
        _bookRepository = bookRepository;
    }

    public async Task Handle(ToggleBookInUsersListCommand request, CancellationToken cancellationToken)
    {
        var user = await _identityRepository.FirstOrDefaultByIdAsync(request.UserId, cancellationToken);
        if (user == null)
        {
            throw new NotFoundException("User not found", ApplicationErrorCodes.UserNotFound);
        }

        var book = await _bookRepository.FirstOrDefaultByIdAsync(request.Id, cancellationToken);
        if (book == null)
        {
            throw new NotFoundException("Book not found", ApplicationErrorCodes.BookNotFound);
        }

        var isObservedByUser = user.BooksObserved.SingleOrDefault(x => x.Id == request.Id);

        if (isObservedByUser == null)
        {
            user.BooksObserved.Add(book);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return;
        }

        user.BooksObserved.Remove(book);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
