using Microsoft.AspNetCore.Mvc;
using Server.Application.Abstractions;
using Server.Application.Command;
using Server.Application.Queries;
using Server.Application.ViewModels;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthorsController : ControllerBase
{
    private readonly IQueryHandler<GetAuthors, IEnumerable<AuthorViewModel>> _getAuthorsHandler;
    private readonly IQueryHandler<GetAuthor, AuthorViewModel> _getAuthorHandler;
    
    private readonly ICommandHandler<AddAuthor> _addAuthorHandler;
    private readonly ICommandHandler<RemoveAuthor> _removeAuthorHandler;

    public AuthorsController(
        IQueryHandler<GetAuthors, IEnumerable<AuthorViewModel>> getAuthorsHandler,
        IQueryHandler<GetAuthor, AuthorViewModel> getAuthorHandler,
        ICommandHandler<AddAuthor> addAuthorHandler, 
        ICommandHandler<RemoveAuthor> removeAuthorHandler)
    {
        _getAuthorsHandler = getAuthorsHandler;
        _getAuthorHandler = getAuthorHandler;
        _addAuthorHandler = addAuthorHandler;
        _removeAuthorHandler = removeAuthorHandler;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AuthorViewModel>>> List()
        =>Ok(await _getAuthorsHandler.HandleAsync(new GetAuthors()));
    
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AuthorViewModel>> Get(Guid id)
        =>Ok(await _getAuthorHandler.HandleAsync(new GetAuthor(id)));

    [HttpPost]
    public async Task<ActionResult> Post(AddAuthor command)
    {
        var id = Guid.NewGuid();
        await _addAuthorHandler.HandleAsync(command with
        {
            Id = id
        });
        
        return Created($"/authors/{id}", null);
    }
    
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Post(Guid id)
    {
        await _removeAuthorHandler.HandleAsync(new RemoveAuthor(id));
        return NoContent();
    }
}