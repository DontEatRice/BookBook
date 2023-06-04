using Microsoft.AspNetCore.Mvc;
using Server.Application.Abstractions;
using Server.Application.Command;
using Server.Application.Queries;
using Server.Application.ViewModels;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class BookCategoriesController : ControllerBase
{
    private readonly IQueryHandler<GetBookCategories, IEnumerable<BookCategoryViewModel>> _getBookCategoriesHandler;
    private readonly IQueryHandler<GetBookCategory, BookCategoryViewModel> _getBookCategoryHandler;

    private readonly ICommandHandler<AddBookCategory> _addBookCategoryHandler;
    private readonly ICommandHandler<RemoveBookCategory> _removeBookCategoryHandler;

    public BookCategoriesController(
        IQueryHandler<GetBookCategories, IEnumerable<BookCategoryViewModel>> getBookCategoriesHandler,
        IQueryHandler<GetBookCategory, BookCategoryViewModel> getBookCategoryHandler,
        ICommandHandler<AddBookCategory> addBookCategoryHandler,
        ICommandHandler<RemoveBookCategory> removeBookCategoryHandler)
    {
        _getBookCategoriesHandler = getBookCategoriesHandler;
        _getBookCategoryHandler = getBookCategoryHandler;
        _addBookCategoryHandler = addBookCategoryHandler;
        _removeBookCategoryHandler = removeBookCategoryHandler;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookCategoryViewModel>>> GetAll()
    {
        return Ok(await _getBookCategoriesHandler.HandleAsync(new GetBookCategories()));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BookCategoryViewModel>> Get(Guid id)
    {
        return Ok(await _getBookCategoryHandler.HandleAsync(new GetBookCategory(id)));
    }

    [HttpPost]
    public async Task<ActionResult> Post(AddBookCategory command)
    {
        var id = Guid.NewGuid();
        await _addBookCategoryHandler.HandleAsync(command with
        {
            Id = id,
        });
        return Created($"/bookCategories/{id}", null);
    }

    [HttpDelete("{id:Guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await _removeBookCategoryHandler.HandleAsync(new RemoveBookCategory(id));
        return NoContent();
    }
}
