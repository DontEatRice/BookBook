using FluentValidation;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.InfrastructureInterfaces;
using Server.Application.ViewModels;
using Server.Domain.DomainServices;
using Server.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Application.CommandHandlers.Auth;

public class LoginAsAdminOrEmployeeCommandValidator : AbstractValidator<LoginAsAdminOrEmployeeCommand>
{
}

public sealed record LoginAsAdminOrEmployeeCommand(string Email, string Password) : IRequest<AuthViewModel>;

public class LoginAsAdminOrEmployeeCommandHandler : IRequestHandler<LoginAsAdminOrEmployeeCommand, AuthViewModel>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityDomainService _identityDomainService;

    public LoginAsAdminOrEmployeeCommandHandler(IUnitOfWork unitOfWork, IIdentityDomainService identityDomainService)
    {
        _unitOfWork = unitOfWork;
        _identityDomainService = identityDomainService;
    }

    public async Task<AuthViewModel> Handle(LoginAsAdminOrEmployeeCommand command, CancellationToken cancellationToken)
    {
        string accessToken, refreshToken;
        try
        {
            (accessToken, refreshToken) = await _identityDomainService
                .LoginAsAdminOrEmployeeAsync(command.Email.ToLower(), command.Password, cancellationToken);
        }
        catch (DomainException ex)
        {
            throw new AuthenticationException(ex.Message, ex.ErrorCode);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new AuthViewModel { AccessToken = accessToken, RefreshToken = refreshToken };
    }
}
