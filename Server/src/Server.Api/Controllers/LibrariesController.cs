﻿using MediatR;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers;
using Server.Application.ViewModels;
using Server.Infrastructure.Persistence.QueryHandlers;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class LibrariesController : ControllerBase
{
    public LibrariesController(IMediator mediator) : base(mediator)
    {
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LibraryViewModel>>> List()
        => Ok(await Mediator.Send(new GetLibrariesQuery()));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AuthorViewModel>> Get(Guid id)
    => Ok(await Mediator.Send(new GetLibraryQuery(id)));

    [HttpPost]
    public async Task<ActionResult> Post(AddLibraryCommand command)
    {
        var id = Guid.NewGuid();
        await Mediator.Send(command with
        {
            Id = id
        });

        return Created($"/libraries/{id}", null);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Post(Guid id)
    {
        await Mediator.Send(new RemoveLibraryCommand(id));
        return NoContent();
    }
}