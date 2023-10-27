using MediatR;

namespace Server.Api.Controllers;

public class ControllerBase : Microsoft.AspNetCore.Mvc.ControllerBase
{
    protected readonly IMediator Mediator;

    public ControllerBase(IMediator mediator)
    {
        Mediator = mediator;
    }
}

public record PaginationRequest(int Offset = 10, int Limit = 0);