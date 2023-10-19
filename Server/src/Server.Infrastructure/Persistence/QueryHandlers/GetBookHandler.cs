using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.ViewModels;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetBookQuery(Guid Id) : IRequest<BookViewModel>;

internal sealed class GetBookHandler : IRequestHandler<GetBookQuery, BookViewModel>
{
    private readonly IBookRepository _bookRepository;
    private readonly IMapper _mapper;

    public GetBookHandler(IBookRepository bookRepository, IMapper mapper)
    {
        _bookRepository = bookRepository;
        _mapper = mapper;
    }

    public async Task<BookViewModel> Handle(GetBookQuery query, CancellationToken cancellationToken)
    {
        var book = await _bookRepository.FirstOrDefaultByIdAsync(query.Id, cancellationToken);

        if (book is null)
        {
            throw new NotFoundException("Book not found", ApplicationErrorCodes.BookNotFound);
        }

        return _mapper.Map<BookViewModel>(book);
    }
}