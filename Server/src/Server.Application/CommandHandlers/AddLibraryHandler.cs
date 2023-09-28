using FluentValidation;
using MediatR;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers;

public sealed class AddLibraryHandlerValidator : AbstractValidator<AddLibraryCommand>
{

}

public sealed record AddLibraryCommand(Guid Id, string Name, int ReservationTime, int HireTime,
    string PostalCode, string City, string Street, string Number, string? Apartment, string? AdditionalInfo,
    TimeSpan? MondayOpenTime, TimeSpan? MondayCloseTime,
    TimeSpan? TuesdayOpenTime, TimeSpan? TuesdayCloseTime,
    TimeSpan? WednesdayOpenTime, TimeSpan? WednesdayCloseTime,
    TimeSpan? ThursdayOpenTime, TimeSpan? ThursdayCloseTime,
    TimeSpan? FridayOpenTime, TimeSpan? FridayCloseTime,
    TimeSpan? SaturdayOpenTime, TimeSpan? SaturdayCloseTime,
    TimeSpan? SundayOpenTime, TimeSpan? SundayCloseTime) : IRequest;

public sealed class AddLibraryHandler : IRequestHandler<AddLibraryCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILibraryRepository _libraryRepository;

    public AddLibraryHandler(IUnitOfWork unitOfWork, ILibraryRepository libraryRepository)
    {
        _unitOfWork = unitOfWork;
        _libraryRepository = libraryRepository;
    }

    public async Task Handle(AddLibraryCommand request, CancellationToken cancellationToken)
    {
        var address = new Address
        {
            PostalCode = request.PostalCode,
            City = request.City,
            Street = request.Street,
            Number = request.Number,
            Apartment = request.Apartment,
            AdditionalInfo = request.AdditionalInfo
        };

        var openHours = new OpenHours
        {
            MondayOpenTime = request.MondayOpenTime,
            MondayCloseTime = request.MondayCloseTime,
            TuesdayOpenTime = request.TuesdayOpenTime,
            TuesdayCloseTime = request.TuesdayCloseTime,
            WednesdayOpenTime = request.WednesdayOpenTime,
            WednesdayCloseTime = request.WednesdayCloseTime,
            ThursdayOpenTime = request.ThursdayOpenTime,
            ThursdayCloseTime = request.ThursdayCloseTime,
            FridayOpenTime = request.FridayOpenTime,
            FridayCloseTime = request.FridayCloseTime,
            SaturdayOpenTime = request.SaturdayOpenTime,
            SaturdayCloseTime = request.SaturdayCloseTime,
            SundayOpenTime = request.SundayOpenTime,
            SundayCloseTime = request.SundayCloseTime
        };

        var library = Library.Create(request.Id, request.Name, request.ReservationTime, request.HireTime, address, openHours);

        _libraryRepository.Add(library);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
