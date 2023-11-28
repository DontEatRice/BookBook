using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.ViewModels;
using Server.Utils;

namespace Server.Infrastructure.Persistence.QueryHandlers.Reservations;

public sealed record GetReservationQuery(Guid ReservationId) 
    : PaginationOptions, IRequest<ReservationWithBooksViewModel>;

internal sealed class GetReservationHandler
    : IRequestHandler<GetReservationQuery, ReservationWithBooksViewModel>
{
    private readonly BookBookDbContext _bookBookDbContext;
    private readonly IMapper _mapper;

    public GetReservationHandler(BookBookDbContext bookBookDbContext, IMapper mapper)
    {
        _bookBookDbContext = bookBookDbContext;
        _mapper = mapper;
    }

    public async Task<ReservationWithBooksViewModel> Handle(
        GetReservationQuery request, CancellationToken cancellationToken)
    {
        var reservation = await _bookBookDbContext.Reservations
            .Where(r => r.Id == request.ReservationId)
            .FirstOrDefaultAsync(cancellationToken);

        if (reservation is null)
        {
            throw new NotFoundException("Reservation not found", ApplicationErrorCodes.ReservationNotFound);
        }

        var bookIds = reservation.ReservationItems.Select(x => x.BookId).ToList();
        
        var books = await _bookBookDbContext.Books
            .Where(b => bookIds.Contains(b.Id))
            .ToListAsync(cancellationToken);

        var library = await _bookBookDbContext.Libraries
            .Where(l => l.Id == reservation.LibraryId)
            .FirstOrDefaultAsync(cancellationToken);

        if (library is null)
        {
            throw new NotFoundException("Library not found", ApplicationErrorCodes.LibraryNotFound);
        }

        return new ReservationWithBooksViewModel
        {
            Id = reservation.Id,
            UserId = reservation.UserId,
            Library = _mapper.Map<LibraryViewModel>(library),
            Books = _mapper.Map<List<BookViewModel>>(books),
            Status = reservation.Status.ToString(),
            ReservationEndDate = reservation.ReservationEndDate
        };
    }
}