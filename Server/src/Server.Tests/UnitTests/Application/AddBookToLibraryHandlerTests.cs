using Moq;
using Server.Application.CommandHandlers.Admin;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;
using Xunit;

namespace Server.Tests.UnitTests.Application;

public class AddBookToLibraryHandlerTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILibraryRepository> _libraryRepositoryMock;
    private readonly Mock<IBookRepository> _bookRepositoryMock;
    private readonly Mock<IBookInLibraryRepository> _bookInLibraryRepositoryMock;
    private readonly AddBookToLibraryHandler _addBookToLibraryHandler;

    public AddBookToLibraryHandlerTests()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _libraryRepositoryMock = new Mock<ILibraryRepository>();
        _bookRepositoryMock = new Mock<IBookRepository>();
        _bookInLibraryRepositoryMock = new Mock<IBookInLibraryRepository>();
        _addBookToLibraryHandler = new AddBookToLibraryHandler(_unitOfWorkMock.Object, _libraryRepositoryMock.Object, _bookRepositoryMock.Object, _bookInLibraryRepositoryMock.Object);
    }

    [Fact]
    public async Task Handle_WhenLibraryDoesNotExist_ShouldThrowNotFoundException()
    {
        // Arrange
        var command = new AddBookToLibraryCommand { BookId = Guid.NewGuid(), Amount = 1, LibraryId = Guid.NewGuid() };
        _libraryRepositoryMock.Setup(x => x.FirstOrDefaultByIdAsync(command.LibraryId, It.IsAny<CancellationToken>())).ReturnsAsync((Library)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<NotFoundException>(() => _addBookToLibraryHandler.Handle(command, CancellationToken.None));
        Assert.Equal(ApplicationErrorCodes.LibraryNotFound, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_WhenBookDoesNotExist_ShouldThrowNotFoundException()
    {
        // Arrange
        var library = new Library();
        var command = new AddBookToLibraryCommand { BookId = Guid.NewGuid(), Amount = 1, LibraryId = library.Id };
        _libraryRepositoryMock.Setup(x => x.FirstOrDefaultByIdAsync(command.LibraryId, It.IsAny<CancellationToken>())).ReturnsAsync(library);
        _bookRepositoryMock.Setup(x => x.FirstOrDefaultByIdAsync(command.BookId, It.IsAny<CancellationToken>())).ReturnsAsync((Book)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<NotFoundException>(() => _addBookToLibraryHandler.Handle(command, CancellationToken.None));
        Assert.Equal(ApplicationErrorCodes.BookNotFound, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_WhenBookAlreadyExistsInLibrary_ShouldThrowValidationException()
    {
        // Arrange
        var library = new Library();
        var book = new Book();
        var command = new AddBookToLibraryCommand { BookId = book.Id, Amount = 1, LibraryId = library.Id };
        _libraryRepositoryMock.Setup(x => x.FirstOrDefaultByIdAsync(command.LibraryId, It.IsAny<CancellationToken>())).ReturnsAsync(library);
        _bookRepositoryMock.Setup(x => x.FirstOrDefaultByIdAsync(command.BookId, It.IsAny<CancellationToken>())).ReturnsAsync(book);
        _bookInLibraryRepositoryMock.Setup(x => x.FirstOrDefaultByLibraryAndBookAsync(command.LibraryId, command.BookId, It.IsAny<CancellationToken>())).ReturnsAsync(new LibraryBook());

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ValidationException>(() => _addBookToLibraryHandler.Handle(command, CancellationToken.None));
        Assert.Contains("Book is already available in this library", exception.Errors.Select(x => x.ErrorMessage));
    }

    [Fact]
    public async Task Handle_WhenAllConditionsAreMet_ShouldAddBookToLibrary()
    {
        // Arrange
        var library = new Library();
        var book = new Book();
        var command = new AddBookToLibraryCommand { BookId = book.Id, Amount = 1, LibraryId = library.Id };
        _libraryRepositoryMock.Setup(x => x.FirstOrDefaultByIdAsync(command.LibraryId, It.IsAny<CancellationToken>())).ReturnsAsync(library);
        _bookRepositoryMock.Setup(x => x.FirstOrDefaultByIdAsync(command.BookId, It.IsAny<CancellationToken>())).ReturnsAsync(book);
        _bookInLibraryRepositoryMock.Setup(x => x.FirstOrDefaultByLibraryAndBookAsync(command.LibraryId, command.BookId, It.IsAny<CancellationToken>())).ReturnsAsync((LibraryBook)null);

        // Act
        await _addBookToLibraryHandler.Handle(command, CancellationToken.None);

        // Assert
        _bookInLibraryRepositoryMock.Verify(x => x.AddAsync(It.IsAny<LibraryBook>(), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}