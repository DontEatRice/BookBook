using MediatR;

namespace Server.Application.CommandHandlers.Images;

public sealed record UploadImageCommand(Guid Id, string ContentType, byte[] Content, string FileName) : IRequest;

public sealed class UploadImageHandler : IRequestHandler<UploadImageCommand>
{
    public async Task Handle(UploadImageCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(10, cancellationToken);
    }
}