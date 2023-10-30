using FluentValidation;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities.User;
using Server.Domain.Repositories;
using System.Text.Json.Serialization;

namespace Server.Application.CommandHandlers.User;

public sealed class ToggleBookInUserListHandlerValidator : AbstractValidator<ToggleBookInUsersListCommand>
{
    public ToggleBookInUserListHandlerValidator()
    {
        RuleFor(x => x.BookId).NotEmpty();
    }
}

public sealed record ToggleBookInUsersListCommand : IRequest
{
    [JsonIgnore]
    public Guid UserId { get; set; }
    public Guid BookId { get; set; }
}

public sealed class ToggleBookInUsersListHandler : IRequestHandler<ToggleBookInUsersListCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityRepository _identityRepository;
    private readonly IBookRepository _bookRepository;
    private readonly IUserBookRepository _userBookRepository;

    public ToggleBookInUsersListHandler(IUnitOfWork unitOfWork, IIdentityRepository identityRepository,
        IBookRepository bookRepository, IUserBookRepository userBookRepository)
    {
        _unitOfWork = unitOfWork;
        _identityRepository = identityRepository;
        _bookRepository = bookRepository;
        _userBookRepository = userBookRepository;
    }

    public async Task Handle(ToggleBookInUsersListCommand request, CancellationToken cancellationToken)
    {
        var user = await _identityRepository.FirstOrDefaultByIdAsync(request.UserId, cancellationToken);
        if (user == null)
        {
            throw new NotFoundException("User not found", ApplicationErrorCodes.UserNotFound);
        }

        var book = await _bookRepository.FirstOrDefaultByIdAsync(request.BookId, cancellationToken);
        if (book == null)
        {
            throw new NotFoundException("Book not found", ApplicationErrorCodes.BookNotFound);
        }

        var userBook = await _userBookRepository.FirstOrDefaultByIdsAsync(request.BookId, request.UserId);

        if(userBook is null)
        {
            _userBookRepository.Add(UserBook.Create(request.UserId, request.BookId));
        }
        else
        {
            await _userBookRepository.RemoveAsync(userBook);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
