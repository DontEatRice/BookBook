using System.Text.Json.Serialization;
using FluentValidation;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers;

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

        if (library == null)
        {
            throw new NotFoundException($"Library with id: {request.LibraryId} not found", ApplicationErrorCodes.LibraryNotFound);
        }

        if (book == null)
        {
            throw new NotFoundException($"Book with id: {request.BookId} not found", ApplicationErrorCodes.BookNotFound);
        }

        var bookInLibrary = LibraryBook.Create(library, book, request.Amount);

        await _bookInLibraryRepository.AddAsync(bookInLibrary, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
    
}
