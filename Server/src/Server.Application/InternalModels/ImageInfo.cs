namespace Server.Application.InternalModels;

public class ImageInfo
{
    public string Etag { get; set; } = null!;
    public DateTime LastModified { get; set; }
}