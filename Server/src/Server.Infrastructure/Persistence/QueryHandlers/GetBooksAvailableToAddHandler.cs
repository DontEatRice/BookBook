using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public sealed record GetBooksAvailableToAddQuery(Guid Id) : IRequest<List<BookViewModel>>;

internal sealed class GetBooksAvailableToAddHandler : IRequestHandler<GetBooksAvailableToAddQuery, List<BookViewModel>>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetBooksAvailableToAddHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<List<BookViewModel>> Handle(GetBooksAvailableToAddQuery request, CancellationToken cancellationToken)
    {
        var booksInLibrary = await _dbContext.LibraryBooks.Where(x => x.LibraryId == request.Id).Select(x => x.Book.Id).ToListAsync();

        var booksToAdd = await _dbContext.Books.Where(x => !booksInLibrary.Contains(x.Id)).ToListAsync();

        return _mapper.Map<List<BookViewModel>>(booksToAdd);
    }
}