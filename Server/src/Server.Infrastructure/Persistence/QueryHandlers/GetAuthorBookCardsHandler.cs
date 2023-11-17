using AutoMapper;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.ViewModels;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public sealed record GetAuthorBookCardsQuery(Guid Id) : IRequest<List<BookViewModel>>;

internal sealed class GetAuthorBookCardsHandler : IRequestHandler<GetAuthorBookCardsQuery, List<BookViewModel>>
{
    private readonly IMapper _mapper;
    private readonly IBookRepository _bookRepository;
    private readonly IAuthorRepository _authorRepository;

    public GetAuthorBookCardsHandler(IMapper mapper, IBookRepository bookRepository, IAuthorRepository authorRepository)
    {
        _mapper = mapper;
        _bookRepository = bookRepository;
        _authorRepository = authorRepository;
    }

    public async Task<List<BookViewModel>> Handle(GetAuthorBookCardsQuery request, CancellationToken cancellationToken)
    {
        var author = await _authorRepository.FirstOrDefaultByIdAsync(request.Id, cancellationToken);

        if (author == null)
        {
            throw new NotFoundException("Author not found", ApplicationErrorCodes.AuthorNotFound);
        }

        var books = await _bookRepository.GetBookCardsByAuthor(author, cancellationToken);

        return _mapper.Map<List<BookViewModel>>(books);
    }
}
