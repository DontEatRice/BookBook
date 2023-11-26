using MediatR;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Admin;

public sealed record RemoveAuthorCommand(Guid Id) : IRequest;

public sealed class RemoveAuthorHandler : IRequestHandler<RemoveAuthorCommand>
{
    //private readonly IUnitOfWork _unitOfWork;
    private readonly IAuthorRepository _authorRepository;

    public RemoveAuthorHandler(IAuthorRepository authorRepository)
    {
        //_unitOfWork = unitOfWork;
        _authorRepository = authorRepository;
    }

    public async Task Handle(RemoveAuthorCommand request, CancellationToken cancellationToken)
    {
        await _authorRepository.Delete(request.Id, cancellationToken);
    }
}