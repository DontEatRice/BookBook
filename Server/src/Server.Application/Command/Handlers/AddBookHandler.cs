using Server.Application.Abstractions;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.Command.Handlers;

public sealed class AddBookHandler : ICommandHandler<AddBook>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBookRepository _bookRepository;

    public AddBookHandler(IUnitOfWork unitOfWork, IBookRepository bookRepository)
    {
        _unitOfWork = unitOfWork;
        _bookRepository = bookRepository;
    }

    public async Task HandleAsync(AddBook command)
    {
        var book = Book.Create(command.Name);

        await _bookRepository.AddAsync(book);

        await _unitOfWork.SaveChangesAsync();
    }
}