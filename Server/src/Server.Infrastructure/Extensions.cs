using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions;
using Server.Infrastructure.Persistence;

namespace Server.Infrastructure;

public static class Extensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddControllers();
        services.AddDatabase(configuration);
        services.AddSwaggerGen();
        
        var assembly = Assembly.GetExecutingAssembly();
        
        services.Scan(s => s.FromAssemblies(assembly)
            .AddClasses(c => c.AssignableTo(typeof(IQueryHandler<,>)))
            .AsImplementedInterfaces()
            .WithScopedLifetime());
        
        return services;
    }

    public static WebApplication UseInfrastructure(this WebApplication app)
    {
        app.UseSwagger();
        app.UseSwaggerUI();
        app.MapControllers();

        return app;
    }
}