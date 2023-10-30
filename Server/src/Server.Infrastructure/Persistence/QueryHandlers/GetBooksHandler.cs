using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetBooksQuery(string? Query, int PageSize = 10, int PageNumber = 0, string? OrderByField = null) 
    : IRequest<PaginatedResponseViewModel<BookViewModel>>;

internal sealed class GetBooksHandler : IRequestHandler<GetBooksQuery, PaginatedResponseViewModel<BookViewModel>>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetBooksHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<PaginatedResponseViewModel<BookViewModel>> Handle(
        GetBooksQuery request, CancellationToken cancellationToken)
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
        
        var (books, totalCount) = await query
            .ProjectTo<BookViewModel>(_mapper.ConfigurationProvider)
            .ToListWithOffsetAsync(request.PageNumber, request.PageSize, cancellationToken);

        var response = new PaginatedResponseViewModel<BookViewModel>
        {
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            Count = totalCount,
            Data = books
        };

        return response;
    }
}