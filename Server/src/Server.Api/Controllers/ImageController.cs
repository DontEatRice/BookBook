using MediatR;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.Images;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ImageController : ControllerBase
{
    public ImageController(IMediator mediator) : base(mediator) {}

    [HttpPost("upload")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Upload([FromBody] UploadImageCommand body)
    {
        var id = Guid.NewGuid();
        await Mediator.Send(body with
        {
            Id = id
        });
        return Created($"image/{id}", null);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id)
    {
        return Ok(await Task.FromResult("hello"));
    }
}