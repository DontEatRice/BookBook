using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record SearchBooksQuery(string searchQuery) : IRequest<IEnumerable<BookViewModel>>;

internal sealed class SearchBooksHandler : IRequestHandler<SearchBooksQuery, IEnumerable<BookViewModel>>
{
    private readonly IBookRepository _bookRepository;
    private readonly IMapper _mapper;

    public SearchBooksHandler(IBookRepository bookRepository, IMapper mapper)
    {
        _bookRepository = bookRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BookViewModel>> Handle(SearchBooksQuery request, CancellationToken cancellationToken)
    {
        var dbResult = await _bookRepository.SearchBooks(request.searchQuery, cancellationToken);
        return _mapper.Map<List<BookViewModel>>(dbResult);
    }
}