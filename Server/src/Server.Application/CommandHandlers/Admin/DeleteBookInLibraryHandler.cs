using MediatR;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Admin;

public sealed record DeleteBookInLibraryCommand : IRequest
{
    public Guid BookId { get; set; }
    public Guid LibraryId { get; set; }
}

public class DeleteBookInLibraryHandler : IRequestHandler<DeleteBookInLibraryCommand>
{
    private readonly IBookInLibraryRepository _bookInLibraryRepository;

    public DeleteBookInLibraryHandler(IBookInLibraryRepository bookInLibraryRepository)
    {
        _bookInLibraryRepository = bookInLibraryRepository;
    }

    public Task Handle(DeleteBookInLibraryCommand request, CancellationToken cancellationToken) =>
        _bookInLibraryRepository.DeleteBookInLibraryAsync(request.LibraryId, request.BookId, cancellationToken);
}