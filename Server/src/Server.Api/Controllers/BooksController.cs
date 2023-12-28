using MediatR;
using Microsoft.AspNetCore.Mvc;
using Server.Application.CommandHandlers.Admin;
using Server.Application.ViewModels;
using Server.Infrastructure.Persistence.QueryHandlers;
using Server.Utils;
using System.Security.Claims;
using Microsoft.Extensions.Caching.Memory;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class BooksController : ControllerBase
{
    private readonly IMemoryCache _memoryCache;
    private const string MostReservedBooksCacheKey = "MostReservedBooks";

    public BooksController(IMediator mediator, IMemoryCache memoryCache) : base(mediator)
    {
        _memoryCache = memoryCache;
    }
    
    [HttpPost("search")]
    public async Task<ActionResult<PaginatedResponseViewModel<BookViewModel>>> List(GetBooksQuery request) 
        => Ok(await Mediator.Send(request));

    [HttpGet("most-reserved")]
    public async Task<ActionResult<IEnumerable<BookViewModel>>> List()
    {
        if (!_memoryCache.TryGetValue(MostReservedBooksCacheKey, out IEnumerable<BookViewModel>? mostReservedBooks))
        {
            mostReservedBooks = await Mediator.Send(new GetBooksWithMostReservationsQuery());
            _memoryCache.Set(MostReservedBooksCacheKey, mostReservedBooks, TimeSpan.FromMinutes(5));
        }

        return Ok(mostReservedBooks);
    }

    [HttpPost("ranking")]
    public async Task<ActionResult<PaginatedResponseViewModel<BookInRankingViewModel>>> List(GetBookRankingQuery request) 
        => Ok(await Mediator.Send(request));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BookViewModel>> Get(Guid id)
    {
        var userId = User.FindFirstValue(AuthConstants.IdClaim);

        return Ok(await Mediator.Send(new GetBookQuery(id, userId)));
    }
    
    [HttpGet("{id:guid}/libraries")]
    public async Task<ActionResult<List<LibraryViewModel>>> GetLibraries(Guid id)
        => Ok(await Mediator.Send(new GetLibrariesWithBookQuery(id)));

    [HttpPost("{id:guid}/reviews/search")]
    public async Task<ActionResult<IEnumerable<ReviewViewModel>>> List(GetReviewsQuery query, Guid id)
        => Ok(await Mediator.Send(query with
        {
            BookId = id
        }));

    [HttpPost]
    public async Task<ActionResult> Post(AddBookCommand command)
    {
        var id = Guid.NewGuid();
        await Mediator.Send(command with
        {
            Id = id
        });

        return Created($"/books/{id}", null);
    }
    
    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, UpdateBookCommand command)
    {
        await Mediator.Send(command with
        {
            Id = id
        });
        
        return Created($"/books/{id}", null);
    }
}