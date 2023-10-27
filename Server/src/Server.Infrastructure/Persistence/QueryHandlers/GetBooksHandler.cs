using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetBooksQuery(string? Query, int Offset, int Limit) : IRequest<IEnumerable<BookViewModel>>;

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
    {
        var queryable = _dbContext.Books
            .AsNoTracking()
            .OrderBy(x => x.Id)
            .Include(x => x.Authors)
            .Include(x => x.BookCategories)
            .Include(x => x.Publisher)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Query))
        {
            queryable = queryable.Where(x => EF.Functions.FreeText(x.FullText, $"{request.Query}"));
        }
        
        var books = await queryable.ToListWithOffsetAsync(request.Offset, request.Limit, cancellationToken);

        return _mapper.Map<List<BookViewModel>>(books);
    }
}