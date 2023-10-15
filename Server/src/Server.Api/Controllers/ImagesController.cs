using System.Net;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Server.Application.CommandHandlers.Images;
using Server.Application.InternalModels;
using Server.Application.Utils;
using Server.Infrastructure.Persistence.QueryHandlers;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ImagesController : ControllerBase
{
    private const string CacheImagePrefix = "IMAGE:";
    private readonly IMemoryCache _memoryCache;
    private const int MaxAge = 3 * 24 * 60 * 60; // Trzy dni * 24 godziny * 60 minut * 60 sekund
    
    public ImagesController(IMediator mediator, ISecurityTokenService securityTokenService, IMemoryCache memoryCache) : base(mediator, securityTokenService)
    {
        _memoryCache = memoryCache;
    }

    [HttpPost("upload")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Upload([FromBody] UploadImageCommand body)
    {
        var id = Guid.NewGuid();
        await Mediator.Send(body with
        {
            Id = id
        });
        return CreatedAtAction(nameof(Get), new { id }, id);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var etag = Request.Headers.IfNoneMatch.ToString();
        if (_memoryCache.TryGetValue(CacheImagePrefix + id.ToString(), out var data) &&
            data is ImageInfo imageInfo &&
            imageInfo.Etag == etag
        )
        {
            Response.Headers.ETag = imageInfo.Etag;
            return StatusCode((int)HttpStatusCode.NotModified);
        }

        var image = await Mediator.Send(new GetImageQuery(id));

        _memoryCache.Set(
            CacheImagePrefix + id,
            new ImageInfo { Etag = image.Etag, LastModified = image.LastModified }, 
            TimeSpan.FromDays(3)
        );
        Response.Headers.CacheControl = $"max-age={MaxAge}";
        Response.Headers.ETag = image.Etag;
        return File(image.Content, image.ContentType);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await Mediator.Send(new RemoveImageCommand(id));
        
        _memoryCache.Remove(CacheImagePrefix + id);
        return NoContent();
    }
}