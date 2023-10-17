using AutoMapper;
using AutoMapper.QueryableExtensions;
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
        var authorViewModel = await _dbContext.Authors
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .ProjectTo<AuthorViewModel>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);

        if (authorViewModel is null)
        {
            throw new NotFoundException("Author not found", ApplicationErrorCodes.AuthorNotFound);
        }

        return authorViewModel;
    }
}