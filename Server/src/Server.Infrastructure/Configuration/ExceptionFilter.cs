using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using Server.Application.Exceptions;
using Server.Domain.Exceptions;

namespace Server.Infrastructure.Configuration;

public class ExceptionFilter : IExceptionFilter
{
    private readonly ILogger<ExceptionFilter> _logger;

    public ExceptionFilter(ILogger<ExceptionFilter> logger)
    {
        _logger = logger;
    }

    public void OnException(ExceptionContext context)
    {
        _logger.LogError(context.Exception, context.Exception.Message);

        var result = context.Exception switch
        {
            AuthenticationException e => new ObjectResult(new
            {
                Type = ExceptionFilterType.Authentication.ToString(),
                Code = e.ErrorCode
            })
            {
                StatusCode = 401
            },

            AuthorizationException e => new ObjectResult(new
            {
                Type = ExceptionFilterType.Authorization.ToString(),
                Code = e.ErrorCode
            })
            {
                StatusCode = 403
            },

            NotFoundException e => new ObjectResult(new
            {
                Type = ExceptionFilterType.NotFound.ToString(),
                Code = e.ErrorCode,
                e.ResourceId
            })
            {
                StatusCode = 404
            },

            LogicException e => new ObjectResult(new
            {
                Type = ExceptionFilterType.Logic.ToString(),
                Code = e.ErrorCode,
                e.ResourceId
            })
            {
                StatusCode = 400
            },
            
            DomainException e => new ObjectResult(new
            {
                Type = ExceptionFilterType.Logic.ToString(),
                Code = e.ErrorCode
            })
            {
                StatusCode = 400
            },

            ValidationException e => new ObjectResult(new
            {
                Type = ExceptionFilterType.Validation.ToString(),
                Code = e.ErrorCode,
                Vaiolations = JsonSerializer.Serialize(e.Errors.Select(er =>
                    new ValidationError { ErrorMessage = er.ErrorMessage, PropertyName = er.PropertyName }))
            })
            {
                StatusCode = 400
            },

            _ => new ObjectResult(new
            {
                Type = ExceptionFilterType.Unexpected.ToString(),
                Code = "UNEXPECTED",
                Message = "Something went wrong"
            })
            {
                StatusCode = 500
            }
        };

        if (context.Exception is ThirdPartyException thirdPartyException)
        {
            result = new ObjectResult(new
            {
                Type = ExceptionFilterType.ThirdParty.ToString(),
                Code = thirdPartyException.Type
            })
            {
                StatusCode = 400
            };
        }

        if (context.Exception is InternalException)
        {
            if (context.Exception is not OperationCanceledException)
            {
                _logger.LogError(context.Exception, "Internal server error");
            }

            // To hide internal errors from users
            // result.StatusCode = 400;
        }

        context.ExceptionHandled = true;
        context.Result = result;
    }
}