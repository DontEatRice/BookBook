using FluentValidation;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;
using System.Text.Json.Serialization;
using ValidationException = Server.Application.Exceptions.ValidationException;

namespace Server.Application.CommandHandlers.Admin;

public sealed class AddBookToLibraryHandlerValidator : AbstractValidator<AddBookToLibraryCommand>
{
    public AddBookToLibraryHandlerValidator()
    {
        RuleFor(x => x.Amount).GreaterThanOrEqualTo(1);
    }
}

public sealed record AddBookToLibraryCommand : IRequest
{
    public Guid BookId { get; set; }
    public int Amount { get; set; }
    [JsonIgnore]
    public Guid LibraryId { get; set; }
}

public sealed class AddBookToLibraryHandler : IRequestHandler<AddBookToLibraryCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILibraryRepository _libraryRepository;
    private readonly IBookRepository _bookRepository;
    private readonly IBookInLibraryRepository _bookInLibraryRepository;

    public AddBookToLibraryHandler(IUnitOfWork unitOfWork, ILibraryRepository libraryRepository,
        IBookRepository bookRepository, IBookInLibraryRepository bookInLibraryRepository)
    {
        _unitOfWork = unitOfWork;
        _libraryRepository = libraryRepository;
        _bookRepository = bookRepository;
        _bookInLibraryRepository = bookInLibraryRepository;
    }

    public async Task Handle(AddBookToLibraryCommand request, CancellationToken cancellationToken)
    {
        var library = await _libraryRepository.FirstOrDefaultByIdAsync(request.LibraryId, cancellationToken);
        var book = await _bookRepository.FirstOrDefaultByIdAsync(request.BookId, cancellationToken);

        if (library is null)
        {
            throw new NotFoundException($"Library with id: {request.LibraryId} not found", ApplicationErrorCodes.LibraryNotFound);
        }

        if (book is null)
        {
            throw new NotFoundException($"Book with id: {request.BookId} not found", ApplicationErrorCodes.BookNotFound);
        }

        var existingAssociation = await _bookInLibraryRepository.FirstOrDefaultByLibraryAndBookAsync(request.LibraryId, request.BookId, cancellationToken);

        if (existingAssociation is not null)
        {
            ValidationError validationError = new ValidationError { PropertyName = null, ErrorMessage = "Book is already available in this library" };
            throw new ValidationException(new List<ValidationError> { validationError });
        }

        var bookInLibrary = LibraryBook.Create(library, book, request.Amount);

        await _bookInLibraryRepository.AddAsync(bookInLibrary, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

}
