using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Admin;

public sealed record UpdateBookCategoryCommand(Guid Id, string Name) : IRequest;

public class UpdateBookCategoryHandler : IRequestHandler<UpdateBookCategoryCommand>
{
    private readonly IBookCategoryRepository _categoryRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateBookCategoryHandler(IBookCategoryRepository categoryRepository, IUnitOfWork unitOfWork)
    {
        _categoryRepository = categoryRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(UpdateBookCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.FirstOrDefaultByIdAsync(request.Id, cancellationToken) ?? 
            throw new NotFoundException("Book category not found", ApplicationErrorCodes.BookCategoryNotFound);

        category.Name = request.Name;

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}