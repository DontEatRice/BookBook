using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public sealed record GetLibraryQuery(Guid Id) : IRequest<LibraryViewModel>;
internal sealed class GetLibraryHandler : IRequestHandler<GetLibraryQuery, LibraryViewModel>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetLibraryHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<LibraryViewModel> Handle(GetLibraryQuery request, CancellationToken cancellationToken)
    {
        var library = await _dbContext.Libraries
            .AsNoTracking()
            .Include(x => x.Address)
            .Include(x => x.OpenHours)
            .SingleOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (library is null)
        {
            throw new NotFoundException("Library not found", ApplicationErrorCodes.LibraryNotFound);
        }

        return _mapper.Map<LibraryViewModel>(library);
    }
}
