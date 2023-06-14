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
    private readonly IQueryHandler<GetBook, BookViewModel> _getBookHandler;

    private readonly ICommandHandler<AddBook> _addBookHandler;
    private readonly ICommandHandler<RemoveBook> _removeBookHandler;

    public BooksController(
        IQueryHandler<GetBooks, IEnumerable<BookViewModel>> getBooksHandler,
        IQueryHandler<GetBook, BookViewModel> getBookHandler,
        ICommandHandler<AddBook> addBookHandler,
        ICommandHandler<RemoveBook> removeBookHandler)
    {
        _getBooksHandler = getBooksHandler;
        _getBookHandler = getBookHandler;
        _addBookHandler = addBookHandler;
        _removeBookHandler = removeBookHandler;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookViewModel>>> List()
        => Ok(await _getBooksHandler.HandleAsync(new GetBooks()));

    [HttpGet("{id:Guid}")]
    public async Task<ActionResult<BookViewModel>> Get(Guid id)
        => Ok(await _getBookHandler.HandleAsync(new GetBook(id)));

    [HttpPost]
    public async Task<ActionResult> Post(AddBook command)
    {
        var id = Guid.NewGuid();
        await _addBookHandler.HandleAsync(command with
        {
            Id = id
        });

        return Created($"/books/{id}", null);
    }

    [HttpDelete("{id:Guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await _removeBookHandler.HandleAsync(new RemoveBook(id));
        return NoContent();
    }
}