using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities.Reservations;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Reservations;

public sealed record ReturnReservationCommand(Guid ReservationId) : IRequest;

public class ReturnReservationCommandHandler : IRequestHandler<ReturnReservationCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IReservationRepository _reservationRepository;
    private readonly ILibraryRepository _libraryRepository;
    private readonly IBookInLibraryRepository _bookInLibraryRepository;

    public ReturnReservationCommandHandler(
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

    public async Task Handle(ReturnReservationCommand request, CancellationToken cancellationToken)
    {
        var reservation = await _reservationRepository.FirstOrDefaultByIdAsync(request.ReservationId, cancellationToken);

        if (reservation is null)
        {
            throw new NotFoundException("Reservation not found", ApplicationErrorCodes.ReservationNotFound);
        }

        if (reservation.Status is not ReservationStatus.GivenOut)
        {
            throw new LogicException("Not given out Reservation cannot be returned", ApplicationErrorCodes.ReservationCannotBeCancelled);
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

        reservation.Status = ReservationStatus.Returned;
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}