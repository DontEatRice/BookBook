using Server.Application.Abstractions;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.Command.Handlers;

public sealed class AddAuthorHandler : ICommandHandler<AddAuthor, Guid>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IAuthorRepository _authorRepository;

    public AddAuthorHandler(IUnitOfWork unitOfWork, IAuthorRepository authorRepository)
    {
        _unitOfWork = unitOfWork;
        _authorRepository = authorRepository;
    }

    public async Task<Guid> HandleAsync(AddAuthor command)
    {
        var author = Author.Create(command.FirstName, command.LastName);

        _authorRepository.Add(author);

        await _unitOfWork.SaveChangesAsync();

        return author.Id;
    }
}