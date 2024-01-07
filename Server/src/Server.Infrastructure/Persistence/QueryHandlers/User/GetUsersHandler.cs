using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;
using Server.Utils;

namespace Server.Infrastructure.Persistence.QueryHandlers.User;

public sealed record GetUsersQuery : PaginationOptions, IRequest<PaginatedResponseViewModel<AdminUserViewModel>>;

internal sealed class GetUsersHandler : IRequestHandler<GetUsersQuery, PaginatedResponseViewModel<AdminUserViewModel>>
{
    private readonly BookBookDbContext _bookDbContext;
    private readonly IMapper _mapper;

    public GetUsersHandler(BookBookDbContext bookDbContext, IMapper mapper)
    {
        _bookDbContext = bookDbContext;
        _mapper = mapper;
    }

    public async Task<PaginatedResponseViewModel<AdminUserViewModel>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var query = _bookDbContext.Identities.AsNoTracking()
            .Where(x => x.Role == Domain.Entities.Auth.Role.User);

        if (!string.IsNullOrWhiteSpace(request.OrderByField))
        {
            query = request.OrderDirection == OrderDirection.Asc
                ? query.OrderBy(request.OrderByField).ThenBy(x => x.Id)
                : query.OrderByDescending(request.OrderByField).ThenBy(x => x.Id);
        }
        else
        {
            query = query.OrderBy(x => x.Id);
        }


        var (users, totalCount) = await query
            .ProjectTo<AdminUserViewModel>(_mapper.ConfigurationProvider)
            .ToListWithOffsetAsync(request.PageNumber, request.PageSize, cancellationToken);

        return new PaginatedResponseViewModel<AdminUserViewModel>
        {
            Count = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            Data = users
        };
    }
}
