using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities.Reservations;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Reservations;

public sealed record MakeReservationCommand(Guid ReservationId, Guid IdentityId, Guid LibraryId) : IRequest;

public class MakeReservationHandler : IRequestHandler<MakeReservationCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICartRepository _cartRepository;
    private readonly IBookInLibraryRepository _bookInLibraryRepository;
    private readonly IReservationRepository _reservationRepository;

    public MakeReservationHandler(
        IUnitOfWork unitOfWork,
        ICartRepository cartRepository,
        IBookInLibraryRepository bookInLibraryRepository,
        IReservationRepository reservationRepository)
    {
        _unitOfWork = unitOfWork;
        _cartRepository = cartRepository;
        _bookInLibraryRepository = bookInLibraryRepository;
        _reservationRepository = reservationRepository;
    }

    public async Task Handle(MakeReservationCommand request, CancellationToken cancellationToken)
    {
        var cart = await _cartRepository.FirstOrDefaultByUserIdAsync(request.IdentityId, cancellationToken);

        if (cart is null)
        {
            throw new NotFoundException("Cart not found", ApplicationErrorCodes.CartNotFound);
        }

        var booksToReserve = cart.CartItems.Where(ci => ci.LibraryId == request.LibraryId).ToList();

        if (!booksToReserve.Any())
        {
            throw new LogicException("No books to reserve", ApplicationErrorCodes.NoBooksToReserve);
        }

        var reservations = await _reservationRepository.ListByUserIdAsync(request.IdentityId, cancellationToken);

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
                    ApplicationErrorCodes.BookNotFound);
            }

            if (bookInLibrary.Available <= 0)
            {
                throw new LogicException($"Book with id: {bookToReserve.BookId} not available",
                    ApplicationErrorCodes.BookNotAvailable);
            }
        }

        var reservation = Reservation.Create(request.ReservationId, request.IdentityId, request.LibraryId);

        foreach (var bookToReserve in booksToReserve)
        {
            var bookInLibrary = await _bookInLibraryRepository.FirstOrDefaultByLibraryAndBookAsync(request.LibraryId,
                bookToReserve.BookId, cancellationToken);

            reservation.ReservationItems.Add(ReservationBook.Create(
                Guid.NewGuid(), request.ReservationId, bookToReserve.BookId, request.LibraryId));

            bookInLibrary!.Available--;
        }

        await _reservationRepository.AddAsync(reservation, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}