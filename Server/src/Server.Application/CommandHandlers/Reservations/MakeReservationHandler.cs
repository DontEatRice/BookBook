using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities.Reservations;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Reservations;

public sealed record MakeReservationCommand(Guid ReservationId, Guid UserId, Guid LibraryId) : IRequest;

public class MakeReservationHandler : IRequestHandler<MakeReservationCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICartRepository _cartRepository;
    private readonly IBookInLibraryRepository _bookInLibraryRepository;
    private readonly IReservationRepository _reservationRepository;
    private readonly ILibraryRepository _libraryRepository;

    public MakeReservationHandler(
        IUnitOfWork unitOfWork,
        ICartRepository cartRepository,
        IBookInLibraryRepository bookInLibraryRepository,
        IReservationRepository reservationRepository,
        ILibraryRepository libraryRepository)
    {
        _unitOfWork = unitOfWork;
        _cartRepository = cartRepository;
        _bookInLibraryRepository = bookInLibraryRepository;
        _reservationRepository = reservationRepository;
        _libraryRepository = libraryRepository;
    }

    public async Task Handle(MakeReservationCommand request, CancellationToken cancellationToken)
    {
        var cart = await _cartRepository.FirstOrDefaultByUserIdAsync(request.UserId, cancellationToken);

        if (cart is null)
        {
            throw new NotFoundException("Cart not found", ApplicationErrorCodes.CartNotFound);
        }

        var booksToReserve = cart.CartItems.Where(ci => ci.LibraryId == request.LibraryId).ToList();

        if (!booksToReserve.Any())
        {
            throw new LogicException("No books to reserve", ApplicationErrorCodes.NoBooksToReserve);
        }

        var reservations = await _reservationRepository.ListByUserIdAsync(request.UserId, cancellationToken);

        if (reservations.Any(r => r.Status == ReservationStatus.Pending && r.LibraryId == request.LibraryId))
        {
            throw new LogicException(
                "You cannot make another reservation in the same library while the other one status is pending",
                ApplicationErrorCodes.CannotMakeAnotherReservation);
        }

        foreach (var bookToReserve in booksToReserve)
        {
            var bookInLibrary =
                await _bookInLibraryRepository.FirstOrDefaultByLibraryAndBookAsync(request.LibraryId,
                    bookToReserve.BookId, cancellationToken);

            if (bookInLibrary is null)
            {
                throw new NotFoundException(
                    $"Book with id: {bookToReserve.BookId} not found in library: {bookToReserve.LibraryId}",
                    ApplicationErrorCodes.BookNotFound, bookToReserve.BookId.ToString());
            }

            if (bookInLibrary.Available <= 0)
            {
                throw new LogicException($"Book with id: {bookToReserve.BookId} not available",
                    ApplicationErrorCodes.BookNotAvailable, bookToReserve.BookId.ToString());
            }
        }

        var library = await _libraryRepository.FirstOrDefaultByIdAsync(request.LibraryId, cancellationToken);

        if (library is null)
        {
            throw new NotFoundException("Library not found", ApplicationErrorCodes.LibraryNotFound);
        }

        var reservation = Reservation.Create(request.ReservationId, request.UserId, request.LibraryId, library.ReservationTime);

        foreach (var bookToReserve in booksToReserve)
        {
            var bookInLibrary = await _bookInLibraryRepository.FirstOrDefaultByLibraryAndBookAsync(request.LibraryId,
                bookToReserve.BookId, cancellationToken);

            reservation.ReservationItems.Add(ReservationBook.Create(
                Guid.NewGuid(), request.ReservationId, bookToReserve.BookId));

            bookInLibrary!.Available--;
        }

        cart.CartItems.Where(ci => ci.LibraryId == request.LibraryId).ToList().ForEach(c => cart.CartItems.Remove(c));

        await _reservationRepository.AddAsync(reservation, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}