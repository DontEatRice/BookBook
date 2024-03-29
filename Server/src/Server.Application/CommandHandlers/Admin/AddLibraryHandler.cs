﻿using FluentValidation;
using MediatR;
using Microsoft.Extensions.Configuration;
using RestSharp;
using Server.Application.ApiResponseModels;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Admin;

public sealed class AddLibraryHandlerValidator : AbstractValidator<AddLibraryCommand>
{

}

public sealed record AddLibraryCommand(Guid Id, string Name, int ReservationTime, int HireTime,
    string emailAddress, string phoneNumber,
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
    private readonly IConfiguration _configuration;

    public AddLibraryHandler(IUnitOfWork unitOfWork, ILibraryRepository libraryRepository, IConfiguration configuration)
    {
        _unitOfWork = unitOfWork;
        _libraryRepository = libraryRepository;
        _configuration = configuration;
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

        var restClientOptions = new RestClientOptions($"https://api.geoapify.com/v1/geocode/search");
        var restClient = new RestClient(restClientOptions);
        var apiRequest = new RestRequest()
            .AddParameter("street", request.Street)
            .AddParameter("housenumber", request.Number)
            .AddParameter("postcode", request.PostalCode)
            .AddParameter("city", request.City)
            .AddParameter("format", "json")
            .AddParameter("apiKey", _configuration.GetSection("ApiKeys").GetValue<string>("GeoapifyApiKey"));

        var apiResponse = await restClient.GetAsync<GeoapifyResponse>(apiRequest, cancellationToken);
        
        var geoLocalization = apiResponse.Results.First();

        var library = Library.Create(request.Id, request.Name, request.ReservationTime, request.HireTime, request.emailAddress, request.phoneNumber, address, openHours, geoLocalization.Lon, geoLocalization.Lat);

        _libraryRepository.Add(library);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
