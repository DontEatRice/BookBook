﻿using MediatR;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Admin;

public sealed record RemoveLibraryCommand(Guid Id) : IRequest;

public sealed class RemoveLibraryHandler : IRequestHandler<RemoveLibraryCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILibraryRepository _libraryRepository;

    public RemoveLibraryHandler(IUnitOfWork unitOfWork, ILibraryRepository libraryRepository)
    {
        _unitOfWork = unitOfWork;
        _libraryRepository = libraryRepository;
    }

    public async Task Handle(RemoveLibraryCommand request, CancellationToken cancellationToken)
    {
        await _libraryRepository.Delete(request.Id, cancellationToken);
    }
}
