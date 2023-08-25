using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Server.Application.Exceptions;
using ValidationException = Server.Application.Exceptions.ValidationException;

namespace Server.Application.DependencyInjection;

public class ValidationExceptionMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (FluentValidation.ValidationException ex)
        {
            var validationException = new ValidationException(
                ex.Errors.Select(error => new ValidationError
                {
                    PropertyName = error.PropertyName,
                    ErrorMessage = error.ErrorMessage
                }).ToList());

            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsync(JsonSerializer.Serialize(validationException));
        }
    }
}
