using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetBookCategoriesQuery : IRequest<IEnumerable<BookCategoryViewModel>>;

internal sealed class GetBookCategoriesHandler : IRequestHandler<GetBookCategoriesQuery, IEnumerable<BookCategoryViewModel>>
{
    private readonly BookBookDbContext _bookDbContext;
    private readonly IMapper _mapper;

    public GetBookCategoriesHandler(BookBookDbContext bookBookDbContext, IMapper mapper)
    {
        _bookDbContext = bookBookDbContext;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BookCategoryViewModel>> Handle(
        GetBookCategoriesQuery request,
        CancellationToken cancellationToken)
        => await _bookDbContext.BookCategories
        .AsNoTracking()
        .Select(x => _mapper.Map<BookCategoryViewModel>(x))
        .ToListAsync(cancellationToken);
}