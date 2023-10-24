using FluentValidation;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.DomainServices;
using Server.Domain.Entities.Auth;
using Server.Domain.Exceptions;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Auth;

public sealed class RegisterEmployeeHandlerValidator : AbstractValidator<RegisterEmployeeCommand>
{
    public RegisterEmployeeHandlerValidator()
    {
        RuleFor(command => command.Email).NotEmpty().EmailAddress();
        RuleFor(command => command.Password).NotEmpty();
        RuleFor(command => command.Name).NotEmpty();
        RuleFor(command => command.LibraryId).NotEmpty();
    }
}

public sealed record RegisterEmployeeCommand(Guid Id, string Email, string Password, string Name, Guid LibraryId) : IRequest;

public sealed class RegisterEmployeeHandler : IRequestHandler<RegisterEmployeeCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityDomainService _identityDomainService;
    private readonly IIdentityRepository _identityRepository;
    private readonly ILibraryRepository _libraryRepository;

    public RegisterEmployeeHandler(
        IUnitOfWork unitOfWork,
        IIdentityDomainService identityDomainService,
        IIdentityRepository identityRepository,
        ILibraryRepository libraryRepository)
    {
        _unitOfWork = unitOfWork;
        _identityDomainService = identityDomainService;
        _identityRepository = identityRepository;
        _libraryRepository = libraryRepository;
    }

    public async Task Handle(RegisterEmployeeCommand request, CancellationToken cancellationToken)
    {
        var library = await _libraryRepository.FirstOrDefaultByIdAsync(request.LibraryId, cancellationToken) ?? throw new NotFoundException("Library not found", ApplicationErrorCodes.LibraryNotFound);

        Identity identity;
        try
        {
            identity = await _identityDomainService.RegisterEmployeeAsync(
                request.Id,
                request.Email,
                request.Password,
                request.Name,
                library,
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