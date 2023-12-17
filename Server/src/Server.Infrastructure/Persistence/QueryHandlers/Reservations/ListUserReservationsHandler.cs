using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;
using Server.Utils;

namespace Server.Infrastructure.Persistence.QueryHandlers.Reservations;

public sealed record ListUserReservationsQuery(Guid UserId) 
    : PaginationOptions, IRequest<PaginatedResponseViewModel<ReservationViewModel>>;

internal sealed class ListUserReservationsHandler
    : IRequestHandler<ListUserReservationsQuery, PaginatedResponseViewModel<ReservationViewModel>>
{
    private readonly BookBookDbContext _bookBookDbContext;
    private readonly IMapper _mapper;

    public ListUserReservationsHandler(BookBookDbContext bookBookDbContext, IMapper mapper)
    {
        _bookBookDbContext = bookBookDbContext;
        _mapper = mapper;
    }

    public async Task<PaginatedResponseViewModel<ReservationViewModel>> Handle(
        ListUserReservationsQuery request, CancellationToken cancellationToken)
    {
        var query = _bookBookDbContext.Reservations
            .Where(r => r.UserId == request.UserId);

        query = !string.IsNullOrWhiteSpace(request.OrderByField) ?
             request.OrderDirection == OrderDirection.Desc ?
             query.OrderByDescending(request.OrderByField) :
             query.OrderBy(request.OrderByField) :
             query.OrderBy(x => x.Id);

        var (reservations, totalCount) = await query
            .ToListWithOffsetAsync(request.PageNumber, request.PageSize, cancellationToken);
        
        var libraryIds = reservations.Select(x => x.LibraryId).ToList();

        var libraries = await _bookBookDbContext.Libraries.Where(l => libraryIds.Contains(l.Id)).ToListAsync(cancellationToken);
        
        return new PaginatedResponseViewModel<ReservationViewModel>
        {
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            Count = totalCount,
            Data = reservations
                .Select(x => new ReservationViewModel
                {
                    Id = x.Id,
                    UserId = x.UserId,
                    Library = _mapper.Map<LibraryViewModel>(libraries.FirstOrDefault(l => l.Id == x.LibraryId)),
                    Status = x.Status.ToString(),
                    CreatedAt = x.CreatedAt,
                    ReservationEndDate = x.ReservationEndDate
                }).ToList()
        };
    }
}