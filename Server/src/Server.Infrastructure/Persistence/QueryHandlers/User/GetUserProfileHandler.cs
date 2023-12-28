using AutoMapper;
using MediatR;
using Server.Application.Exceptions.Types;
using Server.Application.Exceptions;
using Server.Application.ViewModels;
using Server.Domain.Repositories;
using Microsoft.Extensions.Caching.Memory;

namespace Server.Infrastructure.Persistence.QueryHandlers.User;

public sealed record GetUserProfileQuery(Guid Id, Guid? VisitorId) : IRequest<UserProfileViewModel>;
internal sealed class GetUserProfileHandler : IRequestHandler<GetUserProfileQuery, UserProfileViewModel>
{
    private readonly IReservationRepository _reservationRepository;
    private readonly IFollowsRepository _followsRepository;
    private readonly IIdentityRepository _identityRepository;
    private readonly IBookRepository _bookRepository;
    private readonly IMapper _mapper;
    private readonly IMemoryCache _memoryCache;

    public GetUserProfileHandler(
        IReservationRepository reservationRepository,
        IIdentityRepository identityRepository,
        IBookRepository bookRepository,
        IMapper mapper,
        IMemoryCache memoryCache,
        IFollowsRepository followsRepository
    ) {
        _reservationRepository = reservationRepository;
        _identityRepository = identityRepository;
        _bookRepository = bookRepository;
        _mapper = mapper;
        _memoryCache = memoryCache;
        _followsRepository = followsRepository;
    }

    public async Task<UserProfileViewModel> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
    {
        var user = await _identityRepository.FirstOrDefaultByIdAsync(request.Id, cancellationToken);

        if (user == null)
        {
            throw new NotFoundException("User not found", ApplicationErrorCodes.UserNotFound);
        }

        if (!_memoryCache.TryGetValue($"lastReadBooks-{user.Id}", out List<BookViewModel>? userReadBooks) || !_memoryCache.TryGetValue($"readBooksCount-{user.Id}", out int readBooksCount))
        {
            var userReservations = await _reservationRepository.ListByUserIdAsync(request.Id, cancellationToken);

            var userGivenOutReservations = userReservations.
                Where(x => x.Status == Domain.Entities.Reservations.ReservationStatus.GivenOut || x.Status == Domain.Entities.Reservations.ReservationStatus.Returned).ToList();

            var readBooks = userGivenOutReservations
                .OrderBy(x => x.ReservationEndDate)
                .SelectMany(x => x.ReservationItems)
                .Select(x => x.BookId)
                .Distinct()
                .ToList();

            var lastReadBooks = readBooks
                .Take(5)
                .ToList();

            readBooksCount = readBooks.Count;

            userReadBooks = new List<BookViewModel>(); 

            foreach (var book in lastReadBooks)
            {
                userReadBooks.Add(_mapper.Map<BookViewModel>(await _bookRepository.FirstOrDefaultByIdAsync(book, cancellationToken)));
            }

            _memoryCache.Set($"lastReadBooks-{user.Id}", userReadBooks, TimeSpan.FromMinutes(5));

            _memoryCache.Set($"readBooksCount-{user.Id}", readBooksCount, TimeSpan.FromMinutes(5));
        }

        if (!_memoryCache.TryGetValue($"userFollowersCount-{user.Id}", out int followersCount))
        {
            followersCount = await _followsRepository.UserFollowersCountAsync(user.Id, cancellationToken);

            _memoryCache.Set($"userFollowersCount-{user.Id}", followersCount, TimeSpan.FromMinutes(5));
        }

        bool? followedByMe = null;
        if (request.VisitorId is { } followerId)
        {
            followedByMe = await _followsRepository.DoesUserFollowUserAsync(user.Id, followerId, cancellationToken);
        }

        return new UserProfileViewModel
        {
            UserName = user.Name ?? string.Empty,
            UserImageUrl = user.AvatarImageUrl,
            UserLocation = user.Address?.City,
            UserLastReadBooks = userReadBooks,
            AboutMe = user.AboutMe,
            ReadBooksCount = readBooksCount,
            FollowersCount = followersCount,
            IsCritic = user.IsCritic,
            RegisteredAt = user.RegisteredAt,
            FollowedByMe = followedByMe
        };
    }
}
