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

public class MakeReservationHandlerTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ICartRepository> _cartRepositoryMock;
    private readonly Mock<IBookInLibraryRepository> _bookInLibraryRepositoryMock;
    private readonly Mock<IReservationRepository> _reservationRepositoryMock;
    private readonly Mock<ILibraryRepository> _libraryRepositoryMock;
    private readonly MakeReservationHandler _makeReservationHandler;

    public MakeReservationHandlerTests()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _cartRepositoryMock = new Mock<ICartRepository>();
        _bookInLibraryRepositoryMock = new Mock<IBookInLibraryRepository>();
        _reservationRepositoryMock = new Mock<IReservationRepository>();
        _libraryRepositoryMock = new Mock<ILibraryRepository>();
        _makeReservationHandler = new MakeReservationHandler(_unitOfWorkMock.Object, _cartRepositoryMock.Object,
            _bookInLibraryRepositoryMock.Object, _reservationRepositoryMock.Object, _libraryRepositoryMock.Object);
    }

    [Fact]
    public async Task Handle_WhenCartDoesNotExist_ShouldThrowNotFoundException()
    {
        // Arrange
        var command = new MakeReservationCommand(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid());
        _cartRepositoryMock.Setup(x => x.FirstOrDefaultByUserIdAsync(command.UserId, 
            It.IsAny<CancellationToken>())).ReturnsAsync((Cart)null!);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<NotFoundException>(() => _makeReservationHandler.Handle(command, CancellationToken.None));
        Assert.Equal(ApplicationErrorCodes.CartNotFound, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_WhenNoBooksToReserve_ShouldThrowLogicException()
    {
        // Arrange
        var command = new MakeReservationCommand(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid());
        var cart = Cart.Create(command.UserId);
        _cartRepositoryMock.Setup(x => x.FirstOrDefaultByUserIdAsync(command.UserId, It.IsAny<CancellationToken>())).ReturnsAsync(cart);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<LogicException>(() => _makeReservationHandler.Handle(command, CancellationToken.None));
        Assert.Equal(ApplicationErrorCodes.NoBooksToReserve, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_WhenAnotherReservationPending_ShouldThrowLogicException()
    {
        // Arrange
        var command = new MakeReservationCommand(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid());
        var cart = Cart.Create(command.UserId);
        cart.AddBook(new CartBook { BookId = Guid.NewGuid(), LibraryId = command.LibraryId });
        var reservations = new List<Reservation> { new Reservation { Status = ReservationStatus.Pending, LibraryId = command.LibraryId } };
        _cartRepositoryMock.Setup(x => x.FirstOrDefaultByUserIdAsync(command.UserId, It.IsAny<CancellationToken>())).ReturnsAsync(cart);
        _reservationRepositoryMock.Setup(x => x.ListByUserIdAsync(command.UserId, It.IsAny<CancellationToken>())).ReturnsAsync(reservations);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<LogicException>(() => _makeReservationHandler.Handle(command, CancellationToken.None));
        Assert.Equal(ApplicationErrorCodes.CannotMakeAnotherReservation, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_WhenBookNotInLibrary_ShouldThrowNotFoundException()
    {
        // Arrange
        var command = new MakeReservationCommand(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid());
        var cart = Cart.Create(command.UserId);
        cart.AddBook(new CartBook { BookId = Guid.NewGuid(), LibraryId = command.LibraryId });
        var reservations = new List<Reservation>();
        _cartRepositoryMock.Setup(x => x.FirstOrDefaultByUserIdAsync(command.UserId, 
            It.IsAny<CancellationToken>())).ReturnsAsync(cart);
        _reservationRepositoryMock.Setup(x => x.ListByUserIdAsync(command.UserId,
            It.IsAny<CancellationToken>())).ReturnsAsync(reservations);
        _bookInLibraryRepositoryMock.Setup(x =>
            x.FirstOrDefaultByLibraryAndBookAsync(command.LibraryId, It.IsAny<Guid>(), It.IsAny<CancellationToken>())).ReturnsAsync((LibraryBook)null!);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<NotFoundException>(() => _makeReservationHandler.Handle(command, CancellationToken.None));
        Assert.Equal(ApplicationErrorCodes.BookNotFound, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_WhenBookNotAvailable_ShouldThrowLogicException()
    {
        // Arrange
        var command = new MakeReservationCommand(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid());
        var cart = Cart.Create(command.UserId);
        cart.AddBook(new CartBook { BookId = Guid.NewGuid(), LibraryId = command.LibraryId });
        var reservations = new List<Reservation>();
        var bookInLibrary = new LibraryBook { Available = 0 };
        _cartRepositoryMock.Setup(x => x.FirstOrDefaultByUserIdAsync(command.UserId, 
            It.IsAny<CancellationToken>())).ReturnsAsync(cart);
        _reservationRepositoryMock.Setup(x => x.ListByUserIdAsync(command.UserId, 
            It.IsAny<CancellationToken>())).ReturnsAsync(reservations);
        _bookInLibraryRepositoryMock.Setup(x =>
            x.FirstOrDefaultByLibraryAndBookAsync(command.LibraryId, It.IsAny<Guid>(), It.IsAny<CancellationToken>())).ReturnsAsync(bookInLibrary);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<LogicException>(() => _makeReservationHandler.Handle(command, CancellationToken.None));
        Assert.Equal(ApplicationErrorCodes.BookNotAvailable, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_WhenAllConditionsAreMet_ShouldMakeReservation()
    {
        // Arrange
        var command = new MakeReservationCommand(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid());
        var cart = Cart.Create(command.UserId);
        cart.AddBook(new CartBook { BookId = Guid.NewGuid(), LibraryId = command.LibraryId });
        var reservations = new List<Reservation>();
        var bookInLibrary = new LibraryBook { Available = 1 };
        var library = new Library();
        _cartRepositoryMock.Setup(x => x.FirstOrDefaultByUserIdAsync(command.UserId, It.IsAny<CancellationToken>())).ReturnsAsync(cart);
        _reservationRepositoryMock.Setup(x => x.ListByUserIdAsync(command.UserId, It.IsAny<CancellationToken>())).ReturnsAsync(reservations);
        _bookInLibraryRepositoryMock.Setup(x => x.FirstOrDefaultByLibraryAndBookAsync(command.LibraryId, It.IsAny<Guid>(), It.IsAny<CancellationToken>())).ReturnsAsync(bookInLibrary);
        _libraryRepositoryMock.Setup(x => x.FirstOrDefaultByIdAsync(command.LibraryId, It.IsAny<CancellationToken>())).ReturnsAsync(library);

        // Act
        await _makeReservationHandler.Handle(command, CancellationToken.None);

        // Assert
        _reservationRepositoryMock.Verify(x => x.AddAsync(It.IsAny<Reservation>(), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}