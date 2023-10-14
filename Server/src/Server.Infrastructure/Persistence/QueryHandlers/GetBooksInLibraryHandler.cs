using AutoMapper;
using MediatR;
using Server.Application.ViewModels;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public sealed record GetBooksInLibraryQuery(Guid id) : IRequest<List<BookInLibraryViewModel>>;

internal sealed class GetBooksInLibraryHandler : IRequestHandler<GetBooksInLibraryQuery, List<BookInLibraryViewModel>>
{
    private readonly IBookInLibraryRepository _bookInLibraryRepository;
    private readonly IMapper _mapper;

    public GetBooksInLibraryHandler(IBookInLibraryRepository bookInLibraryRepository, IMapper mapper)
    {
        _bookInLibraryRepository = bookInLibraryRepository;
        _mapper = mapper;
    }

    public async Task<List<BookInLibraryViewModel>> Handle(GetBooksInLibraryQuery request, CancellationToken cancellationToken)
    {
        // niestety musi być tak brzydko, ewentualnie jakoś na froncie w Zodzie
        // w BookViewModel zrobić, że Publisher i BookCategories mogą być null, bo tu ich nie potrzebujemy
        var booksInLibrary = await _bookInLibraryRepository.GetAllBooksInProvidedLibrary(request.id, cancellationToken);

        return _mapper.Map<List<BookInLibraryViewModel>>(booksInLibrary);
    }
}
