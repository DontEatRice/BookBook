using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetBooksQuery(string? Query, int Offset, int Limit, string? OrderByField = null) : IRequest<IEnumerable<BookViewModel>>;

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
        var query = _dbContext.Books
            .AsNoTracking();
        
        query = !string.IsNullOrWhiteSpace(request.OrderByField) ? 
            query.OrderBy(request.OrderByField) : 
            query.OrderBy(x => x.Id);

        if (!string.IsNullOrWhiteSpace(request.Query))
        {
            query = query.Where(x => EF.Functions.FreeText(x.FullText, $"{request.Query}"));
        }

        
        return await query
            .ProjectTo<BookViewModel>(_mapper.ConfigurationProvider)
            .ToListWithOffsetAsync(request.Offset, request.Limit, cancellationToken);
    }
}