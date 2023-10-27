using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;
using Server.Domain.Entities.Reservations;

namespace Server.Infrastructure.Persistence.QueryHandlers.Reservations;

public sealed record ListReservationsQuery : IRequest<List<ReservationViewModel>>;

internal sealed class ListReservationsHandler: IRequestHandler<ListReservationsQuery, List<ReservationViewModel>>
{
    private readonly BookBookDbContext _bookBookDbContext;
    private readonly IMapper _mapper;

    public ListReservationsHandler(BookBookDbContext bookBookDbContext, IMapper mapper)
    {
        _bookBookDbContext = bookBookDbContext;
        _mapper = mapper;
    }
    
    public async Task<List<ReservationViewModel>> Handle(ListReservationsQuery request, CancellationToken cancellationToken)
    {
        var reservations = await _bookBookDbContext.Reservations
            .Where(r => r.Status != ReservationStatus.Returned && 
                        r.Status != ReservationStatus.Cancelled &&
                        r.Status != ReservationStatus.CancelledByAdmin)
            .ToListAsync(cancellationToken);
        
        var libraryIds = reservations.Select(x => x.LibraryId).ToList();

        var libraries = await _bookBookDbContext.Libraries.Where(l => libraryIds.Contains(l.Id)).ToListAsync(cancellationToken);
        
        return reservations
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new ReservationViewModel
        {
            Id = x.Id,
            UserId = x.UserId,
            Library = _mapper.Map<LibraryViewModel>(libraries.FirstOrDefault(l => l.Id == x.LibraryId)),
            Status = x.Status.ToString(),
            ReservationEndDate = x.ReservationEndDate
        }).ToList();
    }
    
}