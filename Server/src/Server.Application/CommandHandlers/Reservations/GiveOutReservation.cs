using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities.Reservations;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Reservations;

public sealed record GiveOutReservationCommand(Guid ReservationId) : IRequest;

public class GiveOutReservation : IRequestHandler<GiveOutReservationCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IReservationRepository _reservationRepository;

    public GiveOutReservation(IReservationRepository reservationRepository, IUnitOfWork unitOfWork)
    {
        _reservationRepository = reservationRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(GiveOutReservationCommand request, CancellationToken cancellationToken)
    {
        var reservation = await _reservationRepository.FirstOrDefaultByIdAsync(request.ReservationId, cancellationToken);

        if (reservation is null)
        {
            throw new NotFoundException("Reservation not found", ApplicationErrorCodes.ReservationNotFound);
        }

        reservation.Status = ReservationStatus.GivenOut;

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}