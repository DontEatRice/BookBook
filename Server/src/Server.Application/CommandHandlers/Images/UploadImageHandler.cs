using MediatR;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Images;

public sealed record UploadImageCommand(Guid Id, string ContentType, byte[] Content, string FileName) : IRequest;

public sealed class UploadImageHandler : IRequestHandler<UploadImageCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IImageRepository _imageRepository;

    public UploadImageHandler(IUnitOfWork unitOfWork, IImageRepository imageRepository)
    {
        _unitOfWork = unitOfWork;
        _imageRepository = imageRepository;
    }

    public async Task Handle(UploadImageCommand request, CancellationToken cancellationToken)
    {
        var etag = GenerateEtag();
        var image = Image.Create(request.Id, request.ContentType, request.Content, request.FileName, etag, DateTime.Now);
        
        _imageRepository.Add(image);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private static string GenerateEtag()
    {
        return Guid.NewGuid().ToString().Replace("-", "");
    }
}