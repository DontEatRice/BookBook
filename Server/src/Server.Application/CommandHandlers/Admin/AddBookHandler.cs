using FluentValidation;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Admin;

public sealed class AddBookCommandValidator : AbstractValidator<AddBookCommand>
{
    public AddBookCommandValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.ISBN).NotEmpty().MaximumLength(17).Matches(@"^(?=(?:[^0-9]*[0-9]){10}(?:(?:[^0-9]*[0-9]){3})?$)[\d-]+$");
        RuleFor(x => x.IdPublisher).NotEmpty();
        RuleFor(x => x.AuthorsIDs).NotEmpty();
    }
}

public sealed record AddBookCommand(Guid Id, string ISBN, string Title, int YearPublished,
    string? Description, string Language, int? PageCount, string? CoverPictureUrl,
    Guid IdPublisher, List<Guid> AuthorsIDs, List<Guid> CategoriesIds) : IRequest;

public sealed class AddBookHandler : IRequestHandler<AddBookCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBookRepository _bookRepository;
    private readonly IAuthorRepository _authorRepository;
    private readonly IPublisherRepository _publisherRepository;
    private readonly IBookCategoryRepository _bookCategoryRepository;

    public AddBookHandler(IUnitOfWork unitOfWork, IBookRepository bookRepository,
        IAuthorRepository authorRepository, IPublisherRepository publisherRepository, IBookCategoryRepository bookCategoryRepository)
    {
        _unitOfWork = unitOfWork;
        _bookRepository = bookRepository;
        _authorRepository = authorRepository;
        _publisherRepository = publisherRepository;
        _bookCategoryRepository = bookCategoryRepository;
    }

    public async Task Handle(AddBookCommand request, CancellationToken cancellationToken)
    {
        var publisher = await _publisherRepository.FirstOrDefaultByIdAsync(request.IdPublisher, cancellationToken);

        if (publisher is null)
        {
            throw new NotFoundException("Publisher not found", ApplicationErrorCodes.PublisherNotFound);
        }

        var book = await _bookRepository.FirstOrDefaultByISBNAsync(request.ISBN, cancellationToken);

        if (book is not null)
        {
            throw new LogicException("Book with this ISBN already exists", ApplicationErrorCodes.BookAlreadyAdded);
        }

        var authors = await _authorRepository.ListByIdsAsync(request.AuthorsIDs, cancellationToken);
        var categories = await _bookCategoryRepository.ListByIdsAsync(request.CategoriesIds, cancellationToken);

        book = Book.Create(request.Id, request.ISBN, request.Title, request.YearPublished, request.Description,
            request.Language, request.PageCount, request.CoverPictureUrl, publisher, authors, categories);

        await _bookRepository.AddAsync(book, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}