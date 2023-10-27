using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers.Reservations;

public sealed record ListUserReservationsQuery(Guid UserId) : IRequest<List<ReservationViewModel>>;

internal sealed class ListUserReservationsHandler : IRequestHandler<ListUserReservationsQuery, List<ReservationViewModel>>
{
    private readonly BookBookDbContext _bookBookDbContext;
    private readonly IMapper _mapper;

    public ListUserReservationsHandler(BookBookDbContext bookBookDbContext, IMapper mapper)
    {
        _bookBookDbContext = bookBookDbContext;
        _mapper = mapper;
    }

    public async Task<List<ReservationViewModel>> Handle(ListUserReservationsQuery request, CancellationToken cancellationToken)
    {
        var reservations = await _bookBookDbContext.Reservations
            .Where(r => r.UserId == request.UserId)
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