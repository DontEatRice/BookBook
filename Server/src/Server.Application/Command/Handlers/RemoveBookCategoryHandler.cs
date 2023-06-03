using Server.Application.Abstractions;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;

namespace Server.Application.Command.Handlers;
public class RemoveBookCategoryHandler : ICommandHandler<RemoveBookCategory>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBookCategoryRepository _bookCategoryRepository;

    public RemoveBookCategoryHandler(IUnitOfWork unitOfWork, IBookCategoryRepository bookCategoryRepository)
    {
        _unitOfWork = unitOfWork;
        _bookCategoryRepository = bookCategoryRepository;
    }

    public async Task HandleAsync(RemoveBookCategory command)
    {
        var bookCategory = await _bookCategoryRepository.FirstOrDefaultByIdAsync(command.Id);

        if (bookCategory is not null)
        {
            _bookCategoryRepository.Delete(bookCategory);
        }

        await _unitOfWork.SaveChangesAsync();
    }
}
