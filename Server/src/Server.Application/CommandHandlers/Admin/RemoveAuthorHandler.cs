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
        //var author = await _authorRepository.FirstOrDefaultByIdAsync(request.Id, cancellationToken);

        //if (author != null)
        //{
        //    _authorRepository.Delete(author);
        //}

        //await _unitOfWork.SaveChangesAsync(cancellationToken);
        // Propozycja - przejrzystrzy kod i jedno zapytanie sql mniej
        // TODO przerobić wszystkie delety na takie
        await _authorRepository.Delete(request.Id, cancellationToken);
    }
}