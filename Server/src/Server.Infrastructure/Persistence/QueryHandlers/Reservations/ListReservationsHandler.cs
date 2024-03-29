using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;
using Server.Domain.Entities.Reservations;
using Server.Utils;

namespace Server.Infrastructure.Persistence.QueryHandlers.Reservations;

public sealed record ListReservationsQuery(Guid LibraryId)
    : PaginationOptions, IRequest<PaginatedResponseViewModel<ReservationViewModel>>;

internal sealed class ListReservationsHandler
    : IRequestHandler<ListReservationsQuery, PaginatedResponseViewModel<ReservationViewModel>>
{
    private readonly BookBookDbContext _bookBookDbContext;
    private readonly IMapper _mapper;

    public ListReservationsHandler(BookBookDbContext bookBookDbContext, IMapper mapper)
    {
        _bookBookDbContext = bookBookDbContext;
        _mapper = mapper;
    }
    
    public async Task<PaginatedResponseViewModel<ReservationViewModel>> Handle(
        ListReservationsQuery request,
        CancellationToken cancellationToken)
    {
        var query = _bookBookDbContext.Reservations
            .Where(r => r.Status != ReservationStatus.Returned &&
                        r.Status != ReservationStatus.Cancelled &&
                        r.Status != ReservationStatus.CancelledByAdmin &&
                        r.LibraryId == request.LibraryId);

        if (!string.IsNullOrWhiteSpace(request.OrderByField))
        { 
             query = request.OrderDirection == OrderDirection.Asc
                 ? query.OrderBy(request.OrderByField).ThenBy(x => x.Id)
                 : query.OrderByDescending(request.OrderByField).ThenBy(x => x.Id);
        }
        else
        {
            query = query.OrderByDescending(x => x.CreatedAt);
        }
        var (reservations, totalCount) = await query
            .ToListWithOffsetAsync(request.PageNumber, request.PageSize, cancellationToken);
        
        var libraryIds = reservations.Select(x => x.LibraryId).ToList();

        var libraries = await _bookBookDbContext.Libraries
            .Where(l => libraryIds.Contains(l.Id))
            .ToListAsync(cancellationToken);

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