using AutoMapper;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.ViewModels;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.QueryHandlers.User;

public sealed record GetUserObservedBooksQuery(Guid Id) : IRequest<List<BookViewModel>>;

internal sealed class GetUserObservedBooksHandler : IRequestHandler<GetUserObservedBooksQuery, List<BookViewModel>>
{
    private readonly IIdentityRepository _identityRepository;
    private readonly IUserBookRepository _userBookRepository;
    private readonly IMapper _mapper;

    public GetUserObservedBooksHandler(IIdentityRepository identityRepository, IUserBookRepository userBookRepository, IMapper mapper)
    {
        _identityRepository = identityRepository;
        _userBookRepository = userBookRepository;
        _mapper = mapper;
    }

    public async Task<List<BookViewModel>> Handle(GetUserObservedBooksQuery request, CancellationToken cancellationToken)
    {
        var user = await _identityRepository.FirstOrDefaultByIdAsync(request.Id, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException("User not found", ApplicationErrorCodes.UserNotFound);
        }

        var books =  await _userBookRepository.GetAllByUserId(request.Id, cancellationToken);
        return _mapper.Map<List<BookViewModel>>(books);
    }
}
