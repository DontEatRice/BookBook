using AutoMapper;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.ViewModels;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetBookQuery(Guid Id, string UserId) : IRequest<BookViewModel>;

internal sealed class GetBookHandler : IRequestHandler<GetBookQuery, BookViewModel>
{
    private readonly IBookRepository _bookRepository;
    private readonly IUserBookRepository _userBookRepository;
    private readonly IMapper _mapper;

    public GetBookHandler(IBookRepository bookRepository, IUserBookRepository userBookRepository, IMapper mapper)
    {
        _bookRepository = bookRepository;
        _mapper = mapper;
        _userBookRepository = userBookRepository;
    }

    public async Task<BookViewModel> Handle(GetBookQuery query, CancellationToken cancellationToken)
    {
        var book = await _bookRepository.FirstOrDefaultByIdAsync(query.Id, cancellationToken);

        if (book is null)
        {
            throw new NotFoundException("Book not found", ApplicationErrorCodes.BookNotFound);
        }

        var result = _mapper.Map<BookViewModel>(book);
        if(query.UserId is null)
        {
            result.DoesUserObserve = null;
            return result;
        }

        var userObserve = await _userBookRepository.FirstOrDefaultByIdsAsync(query.Id, Guid.Parse(query.UserId), cancellationToken);

        if(userObserve is null)
        {
            result.DoesUserObserve = false;
            return result;
        }

        result.DoesUserObserve = true; 
        return result;
    }
}