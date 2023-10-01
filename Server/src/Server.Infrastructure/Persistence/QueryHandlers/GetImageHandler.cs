using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InternalModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public sealed record GetImageQuery(Guid Id) : IRequest<ImageWithContent>;

internal class GetImageHandler : IRequestHandler<GetImageQuery, ImageWithContent>
{
    private readonly BookBookDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetImageHandler(BookBookDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<ImageWithContent> Handle(GetImageQuery request, CancellationToken cancellationToken)
    {
        var image = await _dbContext.Images
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .ProjectTo<ImageWithContent>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);
        
        if (image is null)
        {
            throw new NotFoundException("Library not found", ApplicationErrorCodes.ImageNotFound);
        }

        return image;
    }
}