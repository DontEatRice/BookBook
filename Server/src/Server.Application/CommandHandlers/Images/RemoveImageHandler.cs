using MediatR;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Images;

public sealed record RemoveImageCommand(Guid Id) : IRequest;

public class RemoveImageHandler : IRequestHandler<RemoveImageCommand>
{
    private readonly IImageRepository _imageRepository;

    public RemoveImageHandler(IImageRepository imageRepository)
    {
        _imageRepository = imageRepository;
    }


    public async Task Handle(RemoveImageCommand request, CancellationToken cancellationToken)
    {
        await _imageRepository.Remove(request.Id);
    }
}