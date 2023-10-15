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

    public CancelReservationHandler(
        IUnitOfWork unitOfWork,
        IReservationRepository reservationRepository)
    {
        _unitOfWork = unitOfWork;
        _reservationRepository = reservationRepository;
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

        reservation.Status = ReservationStatus.Cancelled;
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}