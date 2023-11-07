using FluentValidation;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Admin;

public sealed class UpdateLibraryCommandValidator : AbstractValidator<UpdateLibraryCommand>
{
    public UpdateLibraryCommandValidator()
    {

    }
}

public sealed record UpdateLibraryCommand(Guid IdLibrary, string Name, int ReservationTime, int HireTime,
    string PostalCode, string City, string Street, string Number, string? Apartment, string? AdditionalInfo,
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
        var library = await _libraryRepository.FirstOrDefaultByIdAsync(request.IdLibrary, cancellationToken);
        
        if (library is null)
        {
            throw new NotFoundException("Library not found", ApplicationErrorCodes.LibraryNotFound);
        }
        
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
        
        library = Library.Update(library, request.Name, request.ReservationTime, request.HireTime, address, openHours);
        
        _libraryRepository.Update(library);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}