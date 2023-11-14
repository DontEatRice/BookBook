using FluentValidation;
using MediatR;
using Microsoft.IdentityModel.Tokens;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Admin;

public sealed class UpdateBookCommandValidator : AbstractValidator<UpdateBookCommand>
{
    
    public UpdateBookCommandValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.ISBN).NotEmpty().MaximumLength(17).Matches(@"^(?=(?:[^0-9]*[0-9]){10}(?:(?:[^0-9]*[0-9]){3})?$)[\d-]+$");
        RuleFor(x => x.IdPublisher).NotEmpty();
        RuleFor(x => x.AuthorsIDs).NotEmpty();
    }
}

public sealed record UpdateBookCommand(Guid IdBook, string ISBN, string Title, int YearPublished,
    Guid IdPublisher, List<Guid> AuthorsIDs, List<Guid> CategoriesIds) : IRequest;

public sealed class UpdateBookHandler : IRequestHandler<UpdateBookCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBookRepository _bookRepository;
    private readonly IAuthorRepository _authorRepository;
    private readonly IPublisherRepository _publisherRepository;
    private readonly IBookCategoryRepository _bookCategoryRepository;
    
    public UpdateBookHandler(IUnitOfWork unitOfWork, IBookRepository bookRepository,
        IAuthorRepository authorRepository, IPublisherRepository publisherRepository, IBookCategoryRepository bookCategoryRepository)
    {
        _unitOfWork = unitOfWork;
        _bookRepository = bookRepository;
        _authorRepository = authorRepository;
        _publisherRepository = publisherRepository;
        _bookCategoryRepository = bookCategoryRepository;
    }

    public async Task Handle(UpdateBookCommand request, CancellationToken cancellationToken)
    {
        var publisher = await _publisherRepository.FirstOrDefaultByIdAsync(request.IdPublisher, cancellationToken);

        if (publisher is null)
        {
            throw new NotFoundException("Publisher not found", ApplicationErrorCodes.PublisherNotFound);
        }
        
        var book = await _bookRepository.FirstOrDefaultByIdAsync(request.IdBook, cancellationToken);
        
        if (book is null)
        {
            throw new NotFoundException("Book not found", ApplicationErrorCodes.BookNotFound);
        }

        var books = await _bookRepository.FindAllAsync(cancellationToken);

        var isUniqueIsbn = books
            .Where(x => x.Id != request.IdBook)
            .Where(x => x.ISBN == request.ISBN).
            IsNullOrEmpty();

        if (!isUniqueIsbn)
        {
            throw new LogicException("Book with this ISBN already exists", ApplicationErrorCodes.BookAlreadyAdded);
        }
        
        var authors = await _authorRepository.ListByIdsAsync(request.AuthorsIDs, cancellationToken);
        var categories = await _bookCategoryRepository.ListByIdsAsync(request.CategoriesIds, cancellationToken);
        
        book.ISBN = request.ISBN;
        book.Title = request.Title;
        book.YearPublished = request.YearPublished;
        book.Publisher = publisher;
        book.Authors = authors;
        book.BookCategories = categories;
        book.FullText = request.ISBN + " " + request.Title + " " + request.YearPublished + " " + publisher.Name + " " +
                        string.Join(" ", authors.Select(x => x.LastName));

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}