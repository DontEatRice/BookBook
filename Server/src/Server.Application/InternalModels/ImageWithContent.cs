namespace Server.Application.InternalModels;

public class ImageWithContent
{
    public string Etag { get; set; } = null!;
    public byte[] Content { get; set; } = null!;
    public string ContentType { get; set; } = null!;
    public DateTime LastModified { get; set; }
}