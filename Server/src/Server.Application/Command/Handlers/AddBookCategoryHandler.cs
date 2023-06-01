using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.Command.Handlers;

public sealed class AddBookCategoryHandler : ICommandHandler<AddBookCategory, Guid>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBookCategoryRepository _bookCategoryRepository;

    public AddBookCategoryHandler(IUnitOfWork unitOfWork, IBookCategoryRepository bookCategoryRepository)
    {
        _unitOfWork = unitOfWork;
        _bookCategoryRepository = bookCategoryRepository;
    }

    public async Task<Guid> HandleAsync(AddBookCategory command)
    {
        var bookCategory = BookCategory.Create(command.Name);

        _bookCategoryRepository.Add(bookCategory);

        await _unitOfWork.SaveChangesAsync();

        return bookCategory.Id;
    }
}

