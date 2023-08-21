using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public sealed record GetAuthorQuery(Guid Id) : IRequest<AuthorViewModel>;

internal sealed class GetAuthorHandler : IRequestHandler<GetAuthorQuery, AuthorViewModel>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetAuthorHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<AuthorViewModel> Handle(GetAuthorQuery request, CancellationToken cancellationToken)
    {
        var author = await _dbContext.Authors
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (author is null)
        {
            throw new NotFoundException("Author not found", ApplicationErrorCodes.AuthorNotFound);
        }

        return _mapper.Map<AuthorViewModel>(author);
    }
}