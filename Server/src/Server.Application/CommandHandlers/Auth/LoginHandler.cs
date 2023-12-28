using FluentValidation;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.InfrastructureInterfaces;
using Server.Application.ViewModels;
using Server.Domain.DomainServices;
using Server.Domain.Exceptions;

namespace Server.Application.CommandHandlers.Auth;

public class IdentityLoginCommandValidator : AbstractValidator<LoginCommand>
{
    public IdentityLoginCommandValidator()
    {
        RuleFor(command => command.Email).NotEmpty().EmailAddress();
        RuleFor(command => command.Password).NotEmpty();
    }
}

public sealed record LoginCommand(string Email, string Password) : IRequest<AuthViewModel>;

public class IdentityLoginCommandHandler : IRequestHandler<LoginCommand, AuthViewModel>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityDomainService _identityDomainService;

    public IdentityLoginCommandHandler(IUnitOfWork unitOfWork, IIdentityDomainService identityDomainService)
    {
        _unitOfWork = unitOfWork;
        _identityDomainService = identityDomainService;
    }

    public async Task<AuthViewModel> Handle(LoginCommand command, CancellationToken cancellationToken)
    {
        string accessToken, refreshToken;
        try
        {
            (accessToken, refreshToken) = await _identityDomainService
                .LoginAsync(command.Email.ToLower(), command.Password, cancellationToken);
        }
        catch (DomainException exception)
        {
            throw new AuthenticationException(exception.Message, exception.ErrorCode);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new AuthViewModel {AccessToken = accessToken, RefreshToken = refreshToken};
    }
}
