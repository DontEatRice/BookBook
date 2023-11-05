using AutoMapper;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.ViewModels;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public sealed record GetAuthorQuery(Guid Id) : IRequest<AuthorViewModel>;

internal sealed class GetAuthorHandler : IRequestHandler<GetAuthorQuery, AuthorViewModel>
{
    private readonly IAuthorRepository _authorRepository;
    private readonly IMapper _mapper;

    public GetAuthorHandler(IAuthorRepository authorRepository, IMapper mapper)
    {
        _authorRepository = authorRepository;
        _mapper = mapper;
    }

    public async Task<AuthorViewModel> Handle(GetAuthorQuery request, CancellationToken cancellationToken)
    {
        var authorViewModel = await _authorRepository.FirstOrDefaultByIdAsync(request.Id, cancellationToken);

        if (authorViewModel is null)
        {
            throw new NotFoundException("Author not found", ApplicationErrorCodes.AuthorNotFound);
        }

        return _mapper.Map<AuthorViewModel>(authorViewModel);
    }
}