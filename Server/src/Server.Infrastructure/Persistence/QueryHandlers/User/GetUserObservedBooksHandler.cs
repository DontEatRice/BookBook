using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.ViewModels;
using Server.Domain.Repositories;
using Server.Utils;

namespace Server.Infrastructure.Persistence.QueryHandlers.User;

public sealed record GetUserObservedBooksQuery(Guid Id) : PaginationOptions, IRequest<PaginatedResponseViewModel<BookViewModel>>;

internal sealed class GetUserObservedBooksHandler : IRequestHandler<GetUserObservedBooksQuery, PaginatedResponseViewModel<BookViewModel>>
{
    private readonly IIdentityRepository _identityRepository;
    private readonly BookBookDbContext _bookBookDbContext;
    private readonly IMapper _mapper;

    public GetUserObservedBooksHandler(IIdentityRepository identityRepository, BookBookDbContext bookBookDbContext, IMapper mapper)
    {
        _identityRepository = identityRepository;
        _bookBookDbContext = bookBookDbContext;
        _mapper = mapper;
    }

    public async Task<PaginatedResponseViewModel<BookViewModel>> Handle(GetUserObservedBooksQuery request, CancellationToken cancellationToken)
    {
        var user = await _identityRepository.FirstOrDefaultByIdAsync(request.Id, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException("User not found", ApplicationErrorCodes.UserNotFound);
        }

        var query = _bookBookDbContext.UserBooks.AsNoTracking()
            .Include(x => x.Book)
            .ThenInclude(x => x.BookCategories)
            .Include(x => x.Book)
            .ThenInclude(x => x.Authors)
            .Where(x => x.UserId == user.Id)
            .Select(x => x.Book)
            .AsSingleQuery();


        var (books, totalCount) = await query
            .ProjectTo<BookViewModel>(_mapper.ConfigurationProvider)
            .ToListWithOffsetAsync(request.PageNumber, request.PageSize, cancellationToken);


        return new PaginatedResponseViewModel<BookViewModel>
        {
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            Count = totalCount,
            Data = books
        };
    }
}
