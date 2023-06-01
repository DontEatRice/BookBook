using Microsoft.AspNetCore.Mvc;
using Server.Application.Abstractions;
using Server.Application.Command;
using Server.Application.Queries;
using Server.Application.ViewModels;

namespace Server.Api.Controllers;

[ApiController]
[Route("[Controller]")]
public class BooksController : ControllerBase
{
    private readonly IQueryHandler<GetBooks, IEnumerable<BookViewModel>> _getBooksHandler;
    
    private readonly ICommandHandler<AddBook> _addBookHandler;

    public BooksController(
        IQueryHandler<GetBooks, IEnumerable<BookViewModel>> getBooksHandler,
        ICommandHandler<AddBook> addBookHandler)
    {
        _getBooksHandler = getBooksHandler;
        _addBookHandler = addBookHandler;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookViewModel>>> Get()
        =>Ok(await _getBooksHandler.HandleAsync(new GetBooks()));
    

    [HttpPost]
    public async Task<ActionResult> Post(AddBook command)
    {
        await _addBookHandler.HandleAsync(command);
        return NoContent();
    }
}