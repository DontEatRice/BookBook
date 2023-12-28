using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.ViewModels;
using Server.Domain.Entities.Auth;
using Server.Domain.Repositories;
using Server.Utils;

namespace Server.Infrastructure.Persistence.QueryHandlers.User;

public sealed record GetUserReviewsQuery (Guid Id) : PaginationOptions, IRequest<PaginatedResponseViewModel<ReviewInUserProfile>>;

internal sealed class GetUserReviewsHandler : IRequestHandler<GetUserReviewsQuery, PaginatedResponseViewModel<ReviewInUserProfile>>
{
    private readonly BookBookDbContext _bookBookDbContext;
    private readonly IIdentityRepository _identityRepository;

    public GetUserReviewsHandler(BookBookDbContext bookBookDbContext, IIdentityRepository identityRepository)
    {
        _bookBookDbContext = bookBookDbContext;
        _identityRepository = identityRepository;
    }

    public async Task<PaginatedResponseViewModel<ReviewInUserProfile>> Handle(GetUserReviewsQuery request, CancellationToken cancellationToken)
    {
        var user = await _identityRepository.FirstOrDefaultByIdAsync(request.Id, cancellationToken);

        if (user == null || user.Role != Role.User)
        {
            throw new NotFoundException("User not found", ApplicationErrorCodes.UserNotFound);
        }

        var (userReviews, totalCount) = await _bookBookDbContext.Reviews.AsNoTracking()
            .Include(x => x.Book)
            .Where(x => x.User.Id == request.Id)
            .Select(x => new ReviewInUserProfile
            {
                UserId = x.User.Id,
                Title = x.Title,
                Description = x.Description,
                Rating = x.Rating,
                BookId = x.Book.Id,
                BookTitle = x.Book.Title,
                BookCoverUrl = x.Book.CoverPictureUrl
            })
            .ToListWithOffsetAsync(request.PageNumber, request.PageSize, cancellationToken);

        return new PaginatedResponseViewModel<ReviewInUserProfile>
        {
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            Count = totalCount,
            Data = userReviews
        };
    }
}
