using Server.Application.Abstractions;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;

namespace Server.Application.Command.Handlers;

public class RemoveBookHandler : ICommandHandler<RemoveBook>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBookRepository _bookRepository;

    public RemoveBookHandler(IUnitOfWork unitOfWork, IBookRepository bookRepository)
    {
        _unitOfWork = unitOfWork;
        _bookRepository = bookRepository;
    }

    public async Task HandleAsync(RemoveBook command)
    {
        var book = await _bookRepository.FirstOrDefaultByIdAsync(command.Id);

        if (book is not null)
        {
            _bookRepository.Delete(book);
        }

        await _unitOfWork.SaveChangesAsync();
    }
}