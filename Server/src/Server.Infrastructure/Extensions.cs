using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Net.Http.Headers;
using Server.Infrastructure.Persistence;
using Server.Application.DependencyInjection;
using Server.Infrastructure.Configuration;

namespace Server.Infrastructure;

public static class Extensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddQueries(configuration);
        services.AddDomainServices();
        services.AddControllers(options => { options.Filters.Add(typeof(ExceptionFilter)); });
        services.AddDatabase(configuration);
        services.AddSwaggerGen();
        services.AddMemoryCache();
        services.AddCors(options =>
        {
            options.AddPolicy(name: "_myPolicy",
                policy =>
                {
                    policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .WithExposedHeaders(HeaderNames.Location);
                });
        });

        return services;
    }

    public static WebApplication UseInfrastructure(this WebApplication app)
    {
        app.UseSwagger();
        app.UseSwaggerUI();
        app.UseCors("_myPolicy");
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseMiddleware<ValidationExceptionMiddleware>();
        app.MapControllers();

        return app;
    }
}