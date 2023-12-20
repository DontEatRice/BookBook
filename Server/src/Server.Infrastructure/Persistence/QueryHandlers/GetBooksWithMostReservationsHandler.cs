using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public sealed record GetBooksWithMostReservationsQuery : IRequest<ICollection<BookViewModel>>;

internal sealed class GetBooksWithMostReservationsHandler
    : IRequestHandler<GetBooksWithMostReservationsQuery, ICollection<BookViewModel>>
{
    private readonly BookBookDbContext _dbContext;

    public GetBooksWithMostReservationsHandler(BookBookDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ICollection<BookViewModel>> Handle(
        GetBooksWithMostReservationsQuery request, CancellationToken cancellationToken)
    {
        var booksWithMostReservations = await _dbContext.Reservations
            .SelectMany(r => r.ReservationItems)
            .GroupBy(ri => ri.BookId)
            .Select(g => new { BookId = g.Key, ReservationCount = g.Select(ri => ri.ReservationId).Distinct().Count() })
            .OrderByDescending(g => g.ReservationCount)
            .Take(3)
            .ToListAsync(cancellationToken);

        var books = await _dbContext.Books
            .Where(x => booksWithMostReservations.Select(r => r.BookId).Contains(x.Id))
            .ToListAsync(cancellationToken);

        return books.Select(b => new BookViewModel
            {
                Id = b.Id,
                Title = b.Title,
                CoverPictureUrl = b.CoverPictureUrl,
                ReservationCount = booksWithMostReservations.First(r => r.BookId == b.Id).ReservationCount
            })
            .OrderByDescending(b => b.ReservationCount).ToList();
    }
}