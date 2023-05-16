using Microsoft.Extensions.DependencyInjection;

namespace BookBook.Domain;

public static class Extensions
{
    public static IServiceCollection AddDomain(this IServiceCollection services)
    {
        return services;
    }
}