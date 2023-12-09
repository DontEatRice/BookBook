using AutoMapper;
using MediatR;
using Microsoft.Extensions.Configuration;
using RestSharp;
using Server.Application.ApiResponseModels;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Application.ViewModels;
using Server.Domain.Entities;
using Server.Domain.Entities.Auth;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.User;

public sealed record UpdateUserProfileCommand(Guid Id, string Name, string? AvatarImageUrl, Guid? LibraryId,
    string? Street, string? Number, string? Apartment, string? PostalCode, string? City, string? AboutMe) : IRequest<UserDetailViewModel>;

public sealed class UpdateUserProfileHandler : IRequestHandler<UpdateUserProfileCommand, UserDetailViewModel>
{
    private readonly IIdentityRepository _identityRepository;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILibraryRepository _libraryRepository;
    private readonly IConfiguration _configuration;

    public UpdateUserProfileHandler(IIdentityRepository identityRepository, IMapper mapper, IUnitOfWork unitOfWork, ILibraryRepository libraryRepository, IConfiguration configuration)
    {
        _identityRepository = identityRepository;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _libraryRepository = libraryRepository;
        _configuration = configuration;
    }

    public async Task<UserDetailViewModel> Handle(UpdateUserProfileCommand request, CancellationToken cancellationToken)
    {
        var identity = await _identityRepository.FirstOrDefaultByIdAsync(request.Id, cancellationToken) ??
            throw new NotFoundException("User not found", ApplicationErrorCodes.UserNotFound);


        if (request.LibraryId is not null &&
            !await _libraryRepository.DoesLibraryExist(request.LibraryId ?? new Guid(), cancellationToken))
        {
            throw new NotFoundException($"Library with id: {request.LibraryId} not found",
                ApplicationErrorCodes.LibraryNotFound);
        }

        Address? address = null;
        double? latitude = null;
        double? longitude = null;
        //brak adresu
        if (request.Street == null || request.Street == "")
        {
            address = null;
            latitude = null;
            longitude = null;
        }
        else
        {
            if (identity.Address != null)
            {
                //adres zmieniony
                if (identity.Address.Street != request.Street || identity.Address.Number != request.Number
                    || identity.Address.PostalCode != request.PostalCode || identity.Address.City != request.City || identity.Address.Apartment != request.Apartment)
                {
                    identity.Address.Street = request.Street;
                    identity.Address.Number = request.Number;
                    identity.Address.Apartment = request.Apartment;
                    identity.Address.PostalCode = request.PostalCode;
                    identity.Address.City = request.City;
                    address = identity.Address;

                    var restClientOptions = new RestClientOptions($"https://api.geoapify.com/v1/geocode/search");
                    var restClient = new RestClient(restClientOptions);
                    var apiRequest = new RestRequest()
                        .AddParameter("street", request.Street)
                        .AddParameter("housenumber", request.Number)
                        .AddParameter("postcode", request.PostalCode)
                        .AddParameter("city", request.City)
                        .AddParameter("format", "json")
                        .AddParameter("apiKey", _configuration.GetSection("ApiKeys").GetValue<string>("GeoapifyApiKey"));

                    var apiResponse = await restClient.GetAsync<GeoapifyResponse>(apiRequest);

                    var geoLocalization = apiResponse.Results.First();

                    latitude = geoLocalization.Lat;
                    longitude = geoLocalization.Lon;
                }
                //adres sie zmienił
                else
                {
                    address = identity.Address;
                    latitude = identity.Latitude;
                    longitude = identity.Longitude;
                }
            }
            //adresu w ogóle nie było, tworzymy nowy
            else
            {
                address = Address.Create(new Guid(), request.PostalCode, request.City, request.Street, request.Number, request.Apartment, null);
                var restClientOptions = new RestClientOptions($"https://api.geoapify.com/v1/geocode/search");
                var restClient = new RestClient(restClientOptions);
                var apiRequest = new RestRequest()
                    .AddParameter("street", request.Street)
                    .AddParameter("housenumber", request.Number)
                    .AddParameter("postcode", request.PostalCode)
                    .AddParameter("city", request.City)
                    .AddParameter("format", "json")
                    .AddParameter("apiKey", _configuration.GetSection("ApiKeys").GetValue<string>("GeoapifyApiKey"));

                var apiResponse = await restClient.GetAsync<GeoapifyResponse>(apiRequest);

                var geoLocalization = apiResponse.Results.First();

                latitude = geoLocalization.Lat;
                longitude = geoLocalization.Lon;
            }
        }

        identity.Update(request.Name, request.AvatarImageUrl, request.LibraryId, address, latitude, longitude, request.AboutMe);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<UserDetailViewModel>(identity);
    }
}