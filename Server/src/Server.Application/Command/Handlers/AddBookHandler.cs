using Server.Application.Abstractions;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.Command.Handlers;

public sealed class AddBookHandler : ICommandHandler<AddBook>
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

    public async Task HandleAsync(AddBook command)
    {
        var publisher = await _publisherRepository.FirstOrDefaultByIdAsync(command.IdPublisher);
        var authors = await _authorRepository.ListByIDs(command.AuthorsIDs);
        var categories = await _bookCategoryRepository.ListByIDs(command.CategoriesIDs);

        var book = Book.Create(command.Id, command.ISBN, command.Title, command.YearPublished,
            command.CoverLink, publisher, authors, categories);

        _bookRepository.Add(book);
        await _unitOfWork.SaveChangesAsync();
    }
}