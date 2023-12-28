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

public class ReturnReservationHandlerTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IReservationRepository> _reservationRepositoryMock;
    private readonly Mock<ILibraryRepository> _libraryRepositoryMock;
    private readonly Mock<IBookInLibraryRepository> _bookInLibraryRepositoryMock;
    private readonly ReturnReservationHandler _returnReservationHandler;

    public ReturnReservationHandlerTests()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _reservationRepositoryMock = new Mock<IReservationRepository>();
        _libraryRepositoryMock = new Mock<ILibraryRepository>();
        _bookInLibraryRepositoryMock = new Mock<IBookInLibraryRepository>();
        _returnReservationHandler = new ReturnReservationHandler(_unitOfWorkMock.Object, _reservationRepositoryMock.Object, _libraryRepositoryMock.Object, _bookInLibraryRepositoryMock.Object);
    }

    [Fact]
    public async Task Handle_WhenReservationDoesNotExist_ShouldThrowNotFoundException()
    {
        // Arrange
        var command = new ReturnReservationCommand(Guid.NewGuid());
        _reservationRepositoryMock.Setup(x => x.FirstOrDefaultByIdAsync(command.ReservationId, It.IsAny<CancellationToken>())).ReturnsAsync((Reservation)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<NotFoundException>(() => _returnReservationHandler.Handle(command, CancellationToken.None));
        Assert.Equal(ApplicationErrorCodes.ReservationNotFound, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_WhenReservationNotGivenOut_ShouldThrowLogicException()
    {
        // Arrange
        var command = new ReturnReservationCommand(Guid.NewGuid());
        var reservation = new Reservation { Status = ReservationStatus.Pending };
        _reservationRepositoryMock.Setup(x => x.FirstOrDefaultByIdAsync(command.ReservationId, It.IsAny<CancellationToken>())).ReturnsAsync(reservation);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<LogicException>(() => _returnReservationHandler.Handle(command, CancellationToken.None));
        Assert.Equal(ApplicationErrorCodes.ReservationCannotBeCancelled, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_WhenLibraryDoesNotExist_ShouldThrowNotFoundException()
    {
        // Arrange
        var command = new ReturnReservationCommand(Guid.NewGuid());
        var reservation = new Reservation { Status = ReservationStatus.GivenOut, LibraryId = Guid.NewGuid() };
        _reservationRepositoryMock.Setup(x => x.FirstOrDefaultByIdAsync(command.ReservationId, It.IsAny<CancellationToken>())).ReturnsAsync(reservation);
        _libraryRepositoryMock.Setup(x => x.FirstOrDefaultByIdAsync(reservation.LibraryId, It.IsAny<CancellationToken>())).ReturnsAsync((Library)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<NotFoundException>(() => _returnReservationHandler.Handle(command, CancellationToken.None));
        Assert.Equal(ApplicationErrorCodes.LibraryNotFound, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_WhenAllConditionsAreMet_ShouldReturnReservation()
    {
        // Arrange
        var library = Library.Create(Guid.NewGuid(), "", 14, 14, "", "",
            Address.Create(Guid.NewGuid(), "", "", "", "", "", ""), new OpenHours(), 0, 0);
        var bookInLibrary = LibraryBook.Create(library, new Book(), 1);
        var command = new ReturnReservationCommand(Guid.NewGuid());
        var reservation = Reservation.Create(command.ReservationId, Guid.NewGuid(), library.Id, 1);
        reservation.Status = ReservationStatus.GivenOut;
      
        _reservationRepositoryMock.Setup(x => x.FirstOrDefaultByIdAsync(command.ReservationId, It.IsAny<CancellationToken>())).ReturnsAsync(reservation);
        _libraryRepositoryMock.Setup(x => x.FirstOrDefaultByIdAsync(reservation.LibraryId, It.IsAny<CancellationToken>())).ReturnsAsync(library);
        _bookInLibraryRepositoryMock.Setup(x => x.FirstOrDefaultByLibraryAndBookAsync(library.Id, It.IsAny<Guid>(), It.IsAny<CancellationToken>())).ReturnsAsync(bookInLibrary);

        // Act
        await _returnReservationHandler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Equal(ReservationStatus.Returned, reservation.Status);
        Assert.Equal(1, bookInLibrary.Available);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}