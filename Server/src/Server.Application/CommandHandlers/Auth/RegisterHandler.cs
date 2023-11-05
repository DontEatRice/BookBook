using FluentValidation;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.DomainServices;
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

public sealed record RegisterCommand(Guid Id, string Email, string Password, string Name, string? AvatarImageUrl) : IRequest;

public sealed class RegisterHandler : IRequestHandler<RegisterCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityDomainService _identityDomainService;
    private readonly IIdentityRepository _identityRepository;

    public RegisterHandler(
        IUnitOfWork unitOfWork,
        IIdentityDomainService identityDomainService,
        IIdentityRepository identityRepository)
    {
        _unitOfWork = unitOfWork;
        _identityDomainService = identityDomainService;
        _identityRepository = identityRepository;
    }

    public async Task Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        Identity identity;
        try
        {
            identity = await _identityDomainService.RegisterAsync(
                request.Id,
                request.Email,
                request.Password,
                request.Name,
                request.AvatarImageUrl,
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