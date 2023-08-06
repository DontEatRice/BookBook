using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions;
using Server.Infrastructure.Persistence;
using System.Reflection;

namespace Server.Infrastructure;

public static class Extensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddControllers();
        services.AddDatabase(configuration);
        services.AddSwaggerGen();
        services.AddCors(options =>
        {
            options.AddPolicy(name: "_myPolicy",
                policy =>
                {
                    policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
                });
        });

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
        app.UseCors("_myPolicy");
        app.MapControllers();

        return app;
    }
}