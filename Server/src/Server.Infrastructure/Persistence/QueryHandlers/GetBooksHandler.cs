using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetBooksQuery : IRequest<IEnumerable<BookViewModel>>;

internal sealed class GetBooksHandler : IRequestHandler<GetBooksQuery, IEnumerable<BookViewModel>>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetBooksHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BookViewModel>> Handle(GetBooksQuery request, CancellationToken cancellationToken)
        => await _dbContext.Books
            .AsNoTracking()
            .Include(x => x.Publisher)
            .Include(x => x.BookCategories)
            .Include(x => x.Authors)
            .Select(x => _mapper.Map<BookViewModel>(x))
            .ToListAsync(cancellationToken);
}