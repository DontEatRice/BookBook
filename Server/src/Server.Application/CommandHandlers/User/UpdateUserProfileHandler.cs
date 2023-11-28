using AutoMapper;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Application.ViewModels;
using Server.Domain.Entities.Auth;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.User;

public sealed record UpdateUserProfileCommand(Guid Id, string Name, string? AvatarImageUrl, Guid? LibraryId) : IRequest<UserDetailViewModel>;

public sealed class UpdateUserProfileHandler : IRequestHandler<UpdateUserProfileCommand, UserDetailViewModel>
{
    private readonly IIdentityRepository _identityRepository;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILibraryRepository _libraryRepository;

    public UpdateUserProfileHandler(IIdentityRepository identityRepository, IMapper mapper, IUnitOfWork unitOfWork, ILibraryRepository libraryRepository)
    {
        _identityRepository = identityRepository;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _libraryRepository = libraryRepository;
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

        identity.Update(request.Name, request.AvatarImageUrl, request.LibraryId);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<UserDetailViewModel>(identity);
    }
}