using Moq;
using Server.Application.CommandHandlers.Reservations;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Entities.Reservations;
using Server.Domain.Repositories;
using Xunit;

namespace Server.Tests.UnitTests.Application;

public class AddToCartHandlerTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ICartRepository> _cartRepositoryMock;
    private readonly Mock<IBookInLibraryRepository> _bookInLibraryRepositoryMock;
    private readonly AddToCartHandler _addToCartHandler;

    public AddToCartHandlerTests()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _cartRepositoryMock = new Mock<ICartRepository>();
        _bookInLibraryRepositoryMock = new Mock<IBookInLibraryRepository>();
        _addToCartHandler = new AddToCartHandler(_unitOfWorkMock.Object, _cartRepositoryMock.Object, _bookInLibraryRepositoryMock.Object);
    }

    [Fact]
    public async Task Handle_WhenCartDoesNotExist_ShouldCreateCartAndAddBook()
    {
        // Arrange
        var command = new AddToCartCommand(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid());
        var bookInLibrary = new LibraryBook { Available = 1 };
        _cartRepositoryMock.Setup(x => x.FirstOrDefaultByUserIdAsync(command.UserId, 
            It.IsAny<CancellationToken>())).ReturnsAsync((Cart)null!);
        _bookInLibraryRepositoryMock.Setup(x => 
            x.FirstOrDefaultByLibraryAndBookAsync(command.LibraryId, command.BookId, It.IsAny<CancellationToken>())).ReturnsAsync(bookInLibrary);

        // Act
        await _addToCartHandler.Handle(command, CancellationToken.None);

        // Assert
        _cartRepositoryMock.Verify(x => x.AddAsync(It.IsAny<Cart>(), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WhenBookAlreadyInCart_ShouldThrowLogicException()
    {
        // Arrange
        var command = new AddToCartCommand(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid());
        var cart = Cart.Create(command.UserId);
        cart.AddBook(new CartBook { BookId = command.BookId, LibraryId = command.LibraryId });
        _cartRepositoryMock.Setup(x => x.FirstOrDefaultByUserIdAsync(command.UserId, It.IsAny<CancellationToken>())).ReturnsAsync(cart);

        // Act
        var exception = await Assert.ThrowsAsync<LogicException>(() => _addToCartHandler.Handle(command, CancellationToken.None));
        
        // Assert
        Assert.Equal(ApplicationErrorCodes.BookAlreadyInCart, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_WhenBookNotInLibrary_ShouldThrowNotFoundException()
    {
        // Arrange
        var command = new AddToCartCommand(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid());
        var cart = Cart.Create(command.UserId);
        _cartRepositoryMock.Setup(x => x.FirstOrDefaultByUserIdAsync(command.UserId, It.IsAny<CancellationToken>())).ReturnsAsync(cart);
        _bookInLibraryRepositoryMock.Setup(x => x.FirstOrDefaultByLibraryAndBookAsync(command.LibraryId, command.BookId, It.IsAny<CancellationToken>())).ReturnsAsync((LibraryBook)null);

        // Act
        var exception = await Assert.ThrowsAsync<NotFoundException>(() => _addToCartHandler.Handle(command, CancellationToken.None));
        
        // Assert
        Assert.Equal(ApplicationErrorCodes.BookNotFound, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_WhenBookNotAvailable_ShouldThrowLogicException()
    {
        // Arrange
        var command = new AddToCartCommand(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid());
        var cart = Cart.Create(command.UserId);
        var bookInLibrary = new LibraryBook { Available = 0 };
        _cartRepositoryMock.Setup(x => x.FirstOrDefaultByUserIdAsync(command.UserId, It.IsAny<CancellationToken>())).ReturnsAsync(cart);
        _bookInLibraryRepositoryMock.Setup(x => x.FirstOrDefaultByLibraryAndBookAsync(command.LibraryId, command.BookId, It.IsAny<CancellationToken>())).ReturnsAsync(bookInLibrary);

        // Act
        var exception = await Assert.ThrowsAsync<LogicException>(() => _addToCartHandler.Handle(command, CancellationToken.None));
        
        // Assert
        Assert.Equal(ApplicationErrorCodes.BookNotAvailable, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_WhenAllConditionsAreMet_ShouldAddBookToCart()
    {
        // Arrange
        var command = new AddToCartCommand(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid());
        var cart = Cart.Create(command.UserId);
        var bookInLibrary = new LibraryBook { Available = 1 };
        _cartRepositoryMock.Setup(x => x.FirstOrDefaultByUserIdAsync(command.UserId, It.IsAny<CancellationToken>())).ReturnsAsync(cart);
        _bookInLibraryRepositoryMock.Setup(x => x.FirstOrDefaultByLibraryAndBookAsync(command.LibraryId, command.BookId, It.IsAny<CancellationToken>())).ReturnsAsync(bookInLibrary);

        // Act
        await _addToCartHandler.Handle(command, CancellationToken.None);

        // Assert
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}