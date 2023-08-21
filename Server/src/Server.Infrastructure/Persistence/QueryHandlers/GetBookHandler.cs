using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetBookQuery(Guid Id) : IRequest<BookViewModel>;

internal sealed class GetBookHandler : IRequestHandler<GetBookQuery, BookViewModel>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetBookHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<BookViewModel> Handle(GetBookQuery query, CancellationToken cancellationToken)
    {
        var book = await _dbContext.Books
            .AsNoTracking()
            .Include(x => x.Publisher)
            .Include(x => x.BookCategories)
            .Include(x => x.Authors)
            .FirstOrDefaultAsync(x => x.Id == query.Id, cancellationToken);

        if (book is null)
        {
            throw new NotFoundException("Book not found", ApplicationErrorCodes.BookNotFound);
        }

        return _mapper.Map<BookViewModel>(book);
    }
}