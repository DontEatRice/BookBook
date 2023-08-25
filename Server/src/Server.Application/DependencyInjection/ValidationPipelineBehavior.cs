using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.Exceptions;
using ValidationException = Server.Application.Exceptions.ValidationException;

namespace Server.Application.DependencyInjection;

// TODO Figure out how to enable ValidationPipelineBehavior or how to catch validation exceptions from fluent validation in ValidationExceptionMiddleware. 
// For now neither of them works and exception we can't the shape of exception
// https://github.com/jbogard/MediatR/issues/879

public sealed class ValidationPipelineBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> 
    where TRequest : notnull
{
    private readonly IList<IValidator<TRequest>> _validators = new List<IValidator<TRequest>>();

    public ValidationPipelineBehavior(IEnumerable<IValidator<TRequest>> validators, IServiceProvider serviceProvider)
    {
        {
            foreach (var validator in validators)
            {
                _validators.Add(validator);
            }

            // handle validators for interfaces directly implemented by command like IListQuery
            foreach (var type in typeof(TRequest).GetInterfaces())
            {
                var interfaceValidators = serviceProvider.GetServices(typeof(IValidator<>).MakeGenericType(type));
                foreach (var validator in interfaceValidators)
                {
                    _validators.Add((IValidator<TRequest>) validator!);
                }
            }
        }
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!_validators.Any())
        {
            return await next();
        }

        var context = new ValidationContext<TRequest>(request);
        var validationErrors = _validators
            .Select(x => x.Validate(context))
            .SelectMany(x => x.Errors)
            .Where(x => x != null)
            .Select(x => new ValidationError { ErrorMessage = x.ErrorMessage, PropertyName = x.PropertyName })
            .ToList();
        
        if (validationErrors.Any())
        {
            throw new ValidationException(validationErrors);
        }

        return await next();
    }

}