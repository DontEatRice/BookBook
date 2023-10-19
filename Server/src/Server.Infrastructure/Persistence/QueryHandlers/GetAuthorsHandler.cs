using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.ViewModels;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetAuthorsQuery : IRequest<IEnumerable<AuthorViewModel>>;

internal sealed class GetAuthorsHandler : IRequestHandler<GetAuthorsQuery, IEnumerable<AuthorViewModel>>
{
    private readonly IAuthorRepository _authorRepository;
    private readonly IMapper _mapper;

    public GetAuthorsHandler(IAuthorRepository authorRepository, IMapper mapper)
    {
        _authorRepository = authorRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<AuthorViewModel>> Handle(GetAuthorsQuery request, CancellationToken cancellationToken)
    {
        var authors = await _authorRepository.FindAllAsync(cancellationToken);
        return _mapper.Map<List<AuthorViewModel>>(authors);
    }
}