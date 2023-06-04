using Server.Application.Abstractions;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.Command.Handlers;

public sealed class AddBookCategoryHandler : ICommandHandler<AddBookCategory>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBookCategoryRepository _bookCategoryRepository;

    public AddBookCategoryHandler(IUnitOfWork unitOfWork, IBookCategoryRepository bookCategoryRepository)
    {
        _unitOfWork = unitOfWork;
        _bookCategoryRepository = bookCategoryRepository;
    }

    public async Task HandleAsync(AddBookCategory command)
    {
        var bookCategory = BookCategory.Create(command.Id, command.Name);

        _bookCategoryRepository.Add(bookCategory);

        await _unitOfWork.SaveChangesAsync();
    }
}

