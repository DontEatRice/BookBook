using Server.Application.Abstractions;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;

namespace Server.Application.Command.Handlers;

public class RemoveAuthorHandler : ICommandHandler<RemoveAuthor, bool>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IAuthorRepository _authorRepository;

    public RemoveAuthorHandler(IUnitOfWork unitOfWork, IAuthorRepository authorRepository)
    {
        _unitOfWork = unitOfWork;
        _authorRepository = authorRepository;
    }

    public async Task<bool> HandleAsync(RemoveAuthor command)
    {
        var author = await _authorRepository.FirstOrDefaultByIdAsync(command.Id);

        if (author != null)
        {
            _authorRepository.Delete(author);
        }

        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}