using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.Utils;
using System.Reflection;

namespace Server.Application.DependencyInjection;

public static class Extensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddCommands();

        return services;
    }

    private static void AddCommands(this IServiceCollection services)
    {
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationPipelineBehavior<,>));
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            cfg.AddOpenBehavior(typeof(ValidationPipelineBehavior<,>));
        });

        services.AddTransient<ValidationExceptionMiddleware>();
        services.AddAutoMapper(typeof(ViewModelProfile));
    }
}