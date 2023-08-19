using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers;

public sealed record AddBookCommand(Guid Id, string ISBN, string Title, int YearPublished, string? CoverLink,
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
        
        var authors = await _authorRepository.ListByIdsAsync(request.AuthorsIDs, cancellationToken);
        var categories = await _bookCategoryRepository.ListByIdsAsync(request.CategoriesIds, cancellationToken);

        var book = Book.Create(request.Id, request.ISBN, request.Title, request.YearPublished,
            request.CoverLink, publisher, authors, categories);

        await _bookRepository.AddAsync(book, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}