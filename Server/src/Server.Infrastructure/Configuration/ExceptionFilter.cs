using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using Server.Application.Exceptions;
using ApplicationException = Server.Application.Exceptions.ApplicationException;

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

        var result = default(ObjectResult);
        if (context.Exception is ApplicationException applicationException)
        {
            result = applicationException switch
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
                    Code = e.ErrorCode
                })
                {
                    StatusCode = 404
                },

                LogicException e => new ObjectResult(new
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
                        new ValidationError(er.ErrorMessage, er.PropertyName)))
                })
                {
                    StatusCode = 400
                },

                InternalException e => new ObjectResult(new
                {
                    Type = ExceptionFilterType.Internal.ToString(),
                    Code = e.ErrorCode
                })
                {
                    StatusCode = 500
                },

                _ => throw new ArgumentOutOfRangeException(nameof(applicationException),
                    "Unknown application exception")
            };
        }

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
                _logger.LogError(context.Exception, "Internal exception occured");
            }

            // To hide internal errors from users
            // result.StatusCode = 400;
        }

        context.ExceptionHandled = true;
        context.Result = result;
    }
}