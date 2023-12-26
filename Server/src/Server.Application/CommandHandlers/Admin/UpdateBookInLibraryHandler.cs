using System.Text.Json.Serialization;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Admin;

public sealed record UpdateBookInLibraryCommand : IRequest
{
    [JsonIgnore]
    public Guid BookId { get; set; }
    public int Amount { get; set; }
    public int Available { get; set; }
    [JsonIgnore]
    public Guid LibraryId { get; set; }
}

public sealed class UpdateBookInLibraryHandler : IRequestHandler<UpdateBookInLibraryCommand>
{
    private readonly IBookInLibraryRepository _bookInLibraryRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateBookInLibraryHandler(IBookInLibraryRepository bookInLibraryRepository, IUnitOfWork unitOfWork)
    {
        _bookInLibraryRepository = bookInLibraryRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(UpdateBookInLibraryCommand request, CancellationToken cancellationToken)
    {
        if (request.Amount < request.Available)
        {
            throw new LogicException("Available can not be smaller than whole amount", ApplicationErrorCodes.AvailableGtAmount);
        }
        
        var libraryBook = await _bookInLibraryRepository.FirstOrDefaultByLibraryAndBookAsync(request.LibraryId, request.BookId, cancellationToken)
            ?? throw new NotFoundException("This book was not found in this library", ApplicationErrorCodes.BookInLibraryNotFound);

        libraryBook.Amount = request.Amount;
        libraryBook.Amount = request.Available;

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}