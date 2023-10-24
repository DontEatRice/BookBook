using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Domain.Repositories;
using System.Text.Json.Serialization;

namespace Server.Infrastructure.Persistence.QueryHandlers.User;

public class DoesUserObserveBook
{
    public bool Observe { get; set; }
}

public sealed record DoesUserObserveBookQuery : IRequest<DoesUserObserveBook>
{
    [JsonIgnore]
    public Guid UserId { get; set; }
    public Guid BookId { get; set; }
}

internal sealed class DoesUserObserveBookHandler : IRequestHandler<DoesUserObserveBookQuery, DoesUserObserveBook>
{
    private readonly IUserBookRepository _userBookRepository;
    private readonly IIdentityRepository _identityRepository;

    public DoesUserObserveBookHandler(IUserBookRepository userBookRepository, IIdentityRepository identityRepository)
    {
        _userBookRepository = userBookRepository;
        _identityRepository = identityRepository;
    }

    public async Task<DoesUserObserveBook> Handle(DoesUserObserveBookQuery request, CancellationToken cancellationToken)
    {
        var user = await _identityRepository.FirstOrDefaultByIdAsync(request.UserId, cancellationToken);

        if(user is null)
        {
            throw new NotFoundException("User not found", ApplicationErrorCodes.UserNotFound);
        }

        var userBook = await _userBookRepository.FirstOrDefaultByIdsAsync(request.BookId, request.UserId);

        if (userBook is null)
        {
            return new DoesUserObserveBook { Observe = false };
        }

        return new DoesUserObserveBook {  Observe = true };
    }
}