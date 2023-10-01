namespace Server.Domain.Entities;

public class Image
{
    public Guid Id { get; set; }
    public string ContentType { get; set; } = null!;
    public byte[] Content { get; set; } = null!;
    public string FileName { get; set; } = null!;
    public string Etag { get; set; } = null!;
    public DateTime LastModified { get; set; }
    
    public static Image Create(Guid id, string contentType, byte[] content, string fileName, string etag, DateTime lastModified)
    {
        return new Image
        {
            Id = id,
            ContentType = contentType,
            Content = content,
            FileName = fileName,
            Etag = etag,
            LastModified = lastModified
        };
    }
}