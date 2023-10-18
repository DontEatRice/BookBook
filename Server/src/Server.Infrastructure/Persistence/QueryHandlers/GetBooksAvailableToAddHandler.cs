using AutoMapper;
using MediatR;
using Server.Application.ViewModels;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public sealed record GetBooksAvailableToAddQuery(Guid Id) : IRequest<List<BookViewModel>>;

internal sealed class GetBooksAvailableToAddHandler : IRequestHandler<GetBooksAvailableToAddQuery, List<BookViewModel>>
{
    private readonly IMapper _mapper;
    private readonly IBookInLibraryRepository _bookInLibraryRepository;
    private readonly IBookRepository _bookRepository;

    public GetBooksAvailableToAddHandler(IMapper mapper, IBookRepository bookRepository, IBookInLibraryRepository bookInLibraryRepository)
    {
        _mapper = mapper;
        _bookRepository = bookRepository;
        _bookInLibraryRepository = bookInLibraryRepository;
    }

    public async Task<List<BookViewModel>> Handle(GetBooksAvailableToAddQuery request, CancellationToken cancellationToken)
    {
        var booksInLibrary = await _bookInLibraryRepository.GetBooksIdsInProvidedLibrary(request.Id, cancellationToken);

        var books = await _bookRepository.FindAsync(cancellationToken, default);

        var booksToAdd = books.Where(x => !booksInLibrary.Contains(x.Id)).ToList();

        return _mapper.Map<List<BookViewModel>>(booksToAdd);
    }
}