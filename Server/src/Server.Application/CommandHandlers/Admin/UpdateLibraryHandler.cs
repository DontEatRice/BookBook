using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Admin;

public sealed record UpdateLibraryCommand(Guid IdLibrary, string Name, int ReservationTime, int HireTime,
    string PostalCode, string City, string Street, string Number, string? Apartment, string? AdditionalInfo,
    string EmailAddress, string PhoneNumber,
    TimeSpan? MondayOpenTime, TimeSpan? MondayCloseTime,
    TimeSpan? TuesdayOpenTime, TimeSpan? TuesdayCloseTime,
    TimeSpan? WednesdayOpenTime, TimeSpan? WednesdayCloseTime,
    TimeSpan? ThursdayOpenTime, TimeSpan? ThursdayCloseTime,
    TimeSpan? FridayOpenTime, TimeSpan? FridayCloseTime,
    TimeSpan? SaturdayOpenTime, TimeSpan? SaturdayCloseTime,
    TimeSpan? SundayOpenTime, TimeSpan? SundayCloseTime) : IRequest;

public sealed class UpdateLibraryHandler : IRequestHandler<UpdateLibraryCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILibraryRepository _libraryRepository;

    public UpdateLibraryHandler(IUnitOfWork unitOfWork, ILibraryRepository libraryRepository)
    {
        _unitOfWork = unitOfWork;
        _libraryRepository = libraryRepository;
    }

    public async Task Handle(UpdateLibraryCommand request, CancellationToken cancellationToken)
    {
        var library = await _libraryRepository.FirstOrDefaultWithDetailsByIdAsync(request.IdLibrary, cancellationToken);
        
        if (library is null)
        {
            throw new NotFoundException("Library not found", ApplicationErrorCodes.LibraryNotFound);
        }

        library.Name = request.Name;
        library.ReservationTime = request.ReservationTime;
        library.HireTime = request.HireTime;
        library.EmailAddress = request.EmailAddress;
        library.PhoneNumber = request.PhoneNumber;
        
        library.Address.City = request.City;
        library.Address.Apartment = request.Apartment;
        library.Address.Street = request.Street;
        library.Address.Number = request.Number;
        library.Address.PostalCode = request.PostalCode;
        library.Address.AdditionalInfo = request.AdditionalInfo;

        library.OpenHours.MondayOpenTime = request.MondayOpenTime;
        library.OpenHours.MondayCloseTime = request.MondayCloseTime;
        library.OpenHours.TuesdayOpenTime = request.TuesdayOpenTime;
        library.OpenHours.TuesdayCloseTime = request.TuesdayCloseTime;
        library.OpenHours.WednesdayOpenTime = request.WednesdayOpenTime;
        library.OpenHours.WednesdayCloseTime = request.WednesdayCloseTime;
        library.OpenHours.ThursdayOpenTime = request.ThursdayOpenTime;
        library.OpenHours.ThursdayCloseTime = request.ThursdayCloseTime;
        library.OpenHours.FridayOpenTime = request.FridayOpenTime;
        library.OpenHours.FridayCloseTime = request.FridayCloseTime;
        library.OpenHours.SaturdayOpenTime = request.SaturdayOpenTime;
        library.OpenHours.SaturdayCloseTime = request.SaturdayCloseTime;
        library.OpenHours.SundayOpenTime = request.SundayOpenTime;
        library.OpenHours.SundayCloseTime = request.SundayCloseTime;

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}