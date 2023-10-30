using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities.Reservations;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Reservations;

public sealed record CancelReservationCommand(Guid ReservationId) : IRequest;

public class CancelReservationHandler : IRequestHandler<CancelReservationCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IReservationRepository _reservationRepository;
    private readonly ILibraryRepository _libraryRepository;
    private readonly IBookInLibraryRepository _bookInLibraryRepository;

    public CancelReservationHandler(
        IUnitOfWork unitOfWork,
        IReservationRepository reservationRepository, 
        ILibraryRepository libraryRepository, 
        IBookInLibraryRepository bookInLibraryRepository)
    {
        _unitOfWork = unitOfWork;
        _reservationRepository = reservationRepository;
        _libraryRepository = libraryRepository;
        _bookInLibraryRepository = bookInLibraryRepository;
    }

    public async Task Handle(CancelReservationCommand request, CancellationToken cancellationToken)
    {
        var reservation = await _reservationRepository.FirstOrDefaultByIdAsync(request.ReservationId, cancellationToken);

        if (reservation is null)
        {
            throw new NotFoundException("Reservation not found", ApplicationErrorCodes.ReservationNotFound);
        }

        if (reservation.Status is not ReservationStatus.Pending)
        {
            throw new LogicException("Reservation cannot be canceled", ApplicationErrorCodes.ReservationCannotBeCancelled);
        }
        
        var library = await _libraryRepository.FirstOrDefaultByIdAsync(reservation.LibraryId, cancellationToken);

        if (library is null)
        {
            throw new NotFoundException("Library not found", ApplicationErrorCodes.LibraryNotFound);
        }
        
        foreach (var reservationItem in reservation.ReservationItems)
        {
            var bookInLibrary = await _bookInLibraryRepository.FirstOrDefaultByLibraryAndBookAsync(library.Id,
                reservationItem.BookId, cancellationToken);

            if (bookInLibrary != null) bookInLibrary.Available++;
        }

        reservation.Status = ReservationStatus.Cancelled;
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}