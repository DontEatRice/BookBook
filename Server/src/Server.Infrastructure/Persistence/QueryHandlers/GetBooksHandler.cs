using AutoMapper;
using MediatR;
using Server.Application.ViewModels;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetBooksQuery(string? Query) : IRequest<IEnumerable<BookViewModel>>;

internal sealed class GetBooksHandler : IRequestHandler<GetBooksQuery, IEnumerable<BookViewModel>>
{
    private readonly IBookRepository _bookRepository;
    private readonly IMapper _mapper;

    public GetBooksHandler(IBookRepository bookRepository, IMapper mapper)
    {
        _bookRepository = bookRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BookViewModel>> Handle(GetBooksQuery request, CancellationToken cancellationToken)
    {
        var books = await _bookRepository.FindAsync(request.Query, cancellationToken);

        return _mapper.Map<List<BookViewModel>>(books);
    }
}