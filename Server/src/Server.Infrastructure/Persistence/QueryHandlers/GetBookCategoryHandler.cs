using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetBookCategoryQuery(Guid Id) : IRequest<BookCategoryViewModel>;

internal sealed class GetBookCategoryHandler : IRequestHandler<GetBookCategoryQuery, BookCategoryViewModel>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetBookCategoryHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<BookCategoryViewModel> Handle(GetBookCategoryQuery request, CancellationToken cancellationToken)
    {
        var bookCategory = await _dbContext.BookCategories
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (bookCategory is null)
        {
            throw new NotFoundException("Book category not found", ApplicationErrorCodes.BookCategoryNotFound);
        }

        return _mapper.Map<BookCategoryViewModel>(bookCategory);
    }
}