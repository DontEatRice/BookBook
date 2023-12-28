using Moq;
using Server.Application.CommandHandlers.Admin;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;
using Xunit;

namespace Server.Tests.UnitTests.Application;

public class AddBookHandlerTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IBookRepository> _bookRepositoryMock;
    private readonly Mock<IAuthorRepository> _authorRepositoryMock;
    private readonly Mock<IPublisherRepository> _publisherRepositoryMock;
    private readonly Mock<IBookCategoryRepository> _bookCategoryRepositoryMock;
    private readonly AddBookHandler _addBookHandler;

    public AddBookHandlerTests()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _bookRepositoryMock = new Mock<IBookRepository>();
        _authorRepositoryMock = new Mock<IAuthorRepository>();
        _publisherRepositoryMock = new Mock<IPublisherRepository>();
        _bookCategoryRepositoryMock = new Mock<IBookCategoryRepository>();
        _addBookHandler = new AddBookHandler(_unitOfWorkMock.Object, _bookRepositoryMock.Object,
            _authorRepositoryMock.Object, _publisherRepositoryMock.Object, _bookCategoryRepositoryMock.Object);
    }

    [Fact]
    public async Task Handle_WhenPublisherDoesNotExist_ShouldThrowNotFoundException()
    {
        // Arrange
        var command = new AddBookCommand(Guid.NewGuid(), "1234567890", "Test Book",
            2022, "Test Description", "English", 100, 
            "https://example.com/cover.jpg", Guid.NewGuid(), 
            new List<Guid> { Guid.NewGuid() }, new List<Guid> { Guid.NewGuid() });
        
        _publisherRepositoryMock.Setup(x => x.FirstOrDefaultByIdAsync(command.IdPublisher,
            It.IsAny<CancellationToken>())).ReturnsAsync((Publisher)null!);

        // Act
        var exception = await Assert.ThrowsAsync<NotFoundException>(() => _addBookHandler.Handle(command, CancellationToken.None));
        
        // Assert
        Assert.Equal(ApplicationErrorCodes.PublisherNotFound, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_WhenBookAlreadyExists_ShouldThrowLogicException()
    {
        // Arrange
        var publisher = new Publisher();
        var command = new AddBookCommand(Guid.NewGuid(), "1234567890", "Test Book", 2022, 
            "Test Description", "English", 100, "https://example.com/cover.jpg",
            publisher.Id, new List<Guid> { Guid.NewGuid() }, new List<Guid> { Guid.NewGuid() });
        _publisherRepositoryMock.Setup(x => x.FirstOrDefaultByIdAsync(command.IdPublisher, 
            It.IsAny<CancellationToken>())).ReturnsAsync(publisher);
        _bookRepositoryMock.Setup(x => x.FirstOrDefaultByISBNAsync(command.ISBN, 
            It.IsAny<CancellationToken>())).ReturnsAsync(new Book());

        // Act
        var exception = await Assert.ThrowsAsync<LogicException>(() => _addBookHandler.Handle(command, CancellationToken.None));
        
        // Assert
        Assert.Equal(ApplicationErrorCodes.BookAlreadyAdded, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_WhenAllConditionsAreMet_ShouldAddBook()
    {
        // Arrange
        var publisher = new Publisher();
        var authors = new List<Author> { new() };
        var categories = new List<BookCategory> { new() };
        var command = new AddBookCommand(Guid.NewGuid(), "1234567890", "Test Book", 2022, 
            "Test Description", "English", 100, "https://example.com/cover.jpg", 
            publisher.Id, new List<Guid> { Guid.NewGuid() }, new List<Guid> { Guid.NewGuid() });
        _publisherRepositoryMock.Setup(x => x.FirstOrDefaultByIdAsync(command.IdPublisher, 
            It.IsAny<CancellationToken>())).ReturnsAsync(publisher);
        _bookRepositoryMock.Setup(x => x.FirstOrDefaultByISBNAsync(command.ISBN, 
            It.IsAny<CancellationToken>())).ReturnsAsync((Book)null!);
        _authorRepositoryMock.Setup(x => x.ListByIdsAsync(command.AuthorsIDs, 
            It.IsAny<CancellationToken>())).ReturnsAsync(authors);
        _bookCategoryRepositoryMock.Setup(x => x.ListByIdsAsync(command.CategoriesIds, 
            It.IsAny<CancellationToken>())).ReturnsAsync(categories);

        // Act
        await _addBookHandler.Handle(command, CancellationToken.None);

        // Assert
        _bookRepositoryMock.Verify(x => x.AddAsync(It.IsAny<Book>(), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}