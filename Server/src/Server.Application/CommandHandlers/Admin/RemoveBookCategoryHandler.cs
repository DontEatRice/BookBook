using MediatR;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Admin;

public sealed record RemoveBookCategoryCommand(Guid Id) : IRequest;

public sealed class RemoveBookCategoryHandler : IRequestHandler<RemoveBookCategoryCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBookCategoryRepository _bookCategoryRepository;

    public RemoveBookCategoryHandler(IUnitOfWork unitOfWork, IBookCategoryRepository bookCategoryRepository)
    {
        _unitOfWork = unitOfWork;
        _bookCategoryRepository = bookCategoryRepository;
    }

    public async Task Handle(RemoveBookCategoryCommand request, CancellationToken cancellationToken)
    {
        var bookCategory = await _bookCategoryRepository.FirstOrDefaultByIdAsync(request.Id, cancellationToken);

        if (bookCategory is not null)
        {
            _bookCategoryRepository.Delete(bookCategory);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
