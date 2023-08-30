using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Server.Infrastructure.Persistence;
using Server.Application.DependencyInjection;
using Server.Application.Utils;
using Server.Infrastructure.Configuration;

namespace Server.Infrastructure;

public static class Extensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddControllers(options => { options.Filters.Add(typeof(ExceptionFilter)); });
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
        services.AddQueries();

        return services;
    }

    public static WebApplication UseInfrastructure(this WebApplication app)
    {
        app.UseSwagger();
        app.UseSwaggerUI();
        app.UseCors("_myPolicy");
        app.UseMiddleware<ValidationExceptionMiddleware>();
        app.MapControllers();

        return app;
    }

    private static void AddQueries(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(ViewModelProfile));
    }
}