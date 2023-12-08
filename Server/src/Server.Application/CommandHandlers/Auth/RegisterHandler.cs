using FluentValidation;
using MediatR;
using Microsoft.Extensions.Configuration;
using RestSharp;
using Server.Application.ApiResponseModels;
using Server.Application.Exceptions;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.DomainServices;
using Server.Domain.Entities;
using Server.Domain.Entities.Auth;
using Server.Domain.Exceptions;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Auth;

public sealed class RegisterHandlerValidator : AbstractValidator<RegisterCommand>
{
    public RegisterHandlerValidator()
    {
        RuleFor(command => command.Email).NotEmpty().EmailAddress();
        RuleFor(command => command.Password).NotEmpty();
        RuleFor(command => command.Name).NotEmpty();
    }
}

public sealed record RegisterCommand(Guid Id, string Email, string Password, string Name, string? AvatarImageUrl, 
    string? Street, string? Number, string? Apartment, string? PostalCode, string? City) : IRequest;

public sealed class RegisterHandler : IRequestHandler<RegisterCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityDomainService _identityDomainService;
    private readonly IIdentityRepository _identityRepository;
    private readonly IConfiguration _configuration;

    public RegisterHandler(
        IUnitOfWork unitOfWork,
        IIdentityDomainService identityDomainService,
        IIdentityRepository identityRepository,
        IConfiguration configuration)
    {
        _unitOfWork = unitOfWork;
        _identityDomainService = identityDomainService;
        _identityRepository = identityRepository;
        _configuration = configuration;
    }

    public async Task Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        Identity identity;
        try
        {
            Address address = null;
            double? latitude = null; 
            double? longitude = null;
            // jeœli przyjdzie Street, to inne pola te¿ przyjd¹
            if(request.Street != null && request.Street != "")
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
            identity = await _identityDomainService.RegisterAsync(
                request.Id,
                request.Email,
                request.Password,
                request.Name,
                request.AvatarImageUrl,
                address,
                latitude,
                longitude,
                cancellationToken);
        }

        catch (DomainException exception)
        {
            throw new AuthenticationException(exception.Message, exception.ErrorCode);
        }
        
        _identityRepository.Add(identity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}