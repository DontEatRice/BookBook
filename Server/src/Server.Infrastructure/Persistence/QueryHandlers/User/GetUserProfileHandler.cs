using AutoMapper;
using MediatR;
using Server.Application.Exceptions.Types;
using Server.Application.Exceptions;
using Server.Application.ViewModels;
using Server.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Server.Domain.Entities;

namespace Server.Infrastructure.Persistence.QueryHandlers.User;

public sealed record GetUserProfileQuery(Guid Id) : IRequest<UserProfileViewModel>;
internal sealed class GetUserProfileHandler : IRequestHandler<GetUserProfileQuery, UserProfileViewModel>
{
    private readonly IReservationRepository _reservationRepository;
    private readonly IIdentityRepository _identityRepository;
    private readonly IBookRepository _bookRepository;
    private readonly IMapper _mapper;

    public GetUserProfileHandler(IReservationRepository reservationRepository, IIdentityRepository identityRepository, IBookRepository bookRepository, IMapper mapper)
    {
        _reservationRepository = reservationRepository;
        _identityRepository = identityRepository;
        _bookRepository = bookRepository;
        _mapper = mapper;
    }

    public async Task<UserProfileViewModel> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
    {
        var user = await _identityRepository.FirstOrDefaultByIdAsync(request.Id, cancellationToken);

        if (user == null)
        {
            throw new NotFoundException("User not found", ApplicationErrorCodes.UserNotFound);
        }

        var userReservations = await _reservationRepository.ListByUserIdAsync(request.Id, cancellationToken);

        var userGivenOutReservations = userReservations.
            Where(x => x.Status == Domain.Entities.Reservations.ReservationStatus.GivenOut || x.Status == Domain.Entities.Reservations.ReservationStatus.Returned).ToList();

        var lastReadBooks = userGivenOutReservations
            .OrderBy(x => x.ReservationEndDate)
            .SelectMany(x => x.ReservationItems)
            .Select(x => x.BookId)
            .Distinct()
            .Take(5)
            .ToList();

        var resultBooks = new List<BookViewModel>();
        foreach (var book in lastReadBooks)
        {
            resultBooks.Add(_mapper.Map<BookViewModel>(await _bookRepository.FirstOrDefaultByIdAsync(book, cancellationToken)));
        }

        return new UserProfileViewModel
        {
            UserName = user.Name,
            UserImageUrl = user.AvatarImageUrl,
            UserLocation = user.Address != null ? user.Address.City : null,
            UserLastReadBooks = resultBooks,
            AboutMe = user.AboutMe
        };
    }
}
