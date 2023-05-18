using Microsoft.Extensions.DependencyInjection;

namespace Server.Application;

public static class Extensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        return services;
    }
}