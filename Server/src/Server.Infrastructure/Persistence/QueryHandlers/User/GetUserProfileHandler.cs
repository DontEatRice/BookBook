using AutoMapper;
using MediatR;
using Server.Application.Exceptions.Types;
using Server.Application.Exceptions;
using Server.Application.ViewModels;
using Server.Domain.Repositories;
using Microsoft.Extensions.Caching.Memory;

namespace Server.Infrastructure.Persistence.QueryHandlers.User;

public sealed record GetUserProfileQuery(Guid Id) : IRequest<UserProfileViewModel>;
internal sealed class GetUserProfileHandler : IRequestHandler<GetUserProfileQuery, UserProfileViewModel>
{
    private readonly IReservationRepository _reservationRepository;
    private readonly IIdentityRepository _identityRepository;
    private readonly IBookRepository _bookRepository;
    private readonly IMapper _mapper;
    private readonly IMemoryCache _memoryCache;

    public GetUserProfileHandler(IReservationRepository reservationRepository, IIdentityRepository identityRepository, IBookRepository bookRepository, IMapper mapper, IMemoryCache memoryCache)
    {
        _reservationRepository = reservationRepository;
        _identityRepository = identityRepository;
        _bookRepository = bookRepository;
        _mapper = mapper;
        _memoryCache = memoryCache;
    }

    public async Task<UserProfileViewModel> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
    {
        var user = await _identityRepository.FirstOrDefaultByIdAsync(request.Id, cancellationToken);

        if (user == null)
        {
            throw new NotFoundException("User not found", ApplicationErrorCodes.UserNotFound);
        }

        var userReadBooks = new List<BookViewModel>();
        int readBooksCount = 0;

        if (!_memoryCache.TryGetValue($"lastReadBooks-{user.Id}", out userReadBooks) || !_memoryCache.TryGetValue($"readBooksCount-{user.Id}", out readBooksCount))
        {
            var userReservations = await _reservationRepository.ListByUserIdAsync(request.Id, cancellationToken);

            var userGivenOutReservations = userReservations.
                Where(x => x.Status == Domain.Entities.Reservations.ReservationStatus.GivenOut || x.Status == Domain.Entities.Reservations.ReservationStatus.Returned).ToList();

            var readBooks = userGivenOutReservations
                .OrderBy(x => x.ReservationEndDate)
                .SelectMany(x => x.ReservationItems)
                .Select(x => x.BookId)
                .Distinct();

            var lastReadBooks = readBooks
                .Take(5)
                .ToList();

            readBooksCount = readBooks.Count();

            userReadBooks = new List<BookViewModel>(); 

            foreach (var book in lastReadBooks)
            {
                userReadBooks.Add(_mapper.Map<BookViewModel>(await _bookRepository.FirstOrDefaultByIdAsync(book, cancellationToken)));
            }

            _memoryCache.Set($"lastReadBooks-{user.Id}", userReadBooks, new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
            });

            _memoryCache.Set($"readBooksCount-{user.Id}", readBooksCount, new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
            });
        }

        return new UserProfileViewModel
        {
            UserName = user.Name,
            UserImageUrl = user.AvatarImageUrl,
            UserLocation = user.Address != null ? user.Address.City : null,
            UserLastReadBooks = userReadBooks,
            AboutMe = user.AboutMe,
            ReadBooksCount = readBooksCount,
            IsCritic = user.IsCritic,
            RegisteredAt = user.RegisteredAt
        };
    }
}
