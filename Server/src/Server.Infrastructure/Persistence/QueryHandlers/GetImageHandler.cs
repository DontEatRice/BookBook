using MediatR;
using Server.Application.InternalModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public sealed record GetImageQuery(Guid Id) : IRequest<ImageWithContent>;

internal class GetImageHandler : IRequestHandler<GetImageQuery, ImageWithContent>
{
    public Task<ImageWithContent> Handle(GetImageQuery request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}