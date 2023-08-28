using MediatR;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Admin;

public sealed record RemoveBookCommand(Guid Id) : IRequest;

public sealed class RemoveBookHandler : IRequestHandler<RemoveBookCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBookRepository _bookRepository;

    public RemoveBookHandler(IUnitOfWork unitOfWork, IBookRepository bookRepository)
    {
        _unitOfWork = unitOfWork;
        _bookRepository = bookRepository;
    }

    public async Task Handle(RemoveBookCommand request, CancellationToken cancellationToken)
    {
        var book = await _bookRepository.FirstOrDefaultByIdAsync(request.Id, cancellationToken);

        if (book is not null)
        {
            _bookRepository.Delete(book);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}