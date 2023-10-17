using MediatR;
using Microsoft.AspNetCore.Mvc;
using Server.Application.Utils;

namespace Server.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ReservationsController : ControllerBase
{
    public ReservationsController(IMediator mediator) : base(mediator)
    {
    }
}