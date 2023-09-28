using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Server.Application.InfrastructureInterfaces;
using Server.Application.Utils;
using Server.Domain.DomainServices;
using Server.Domain.Repositories;
using Server.Infrastructure.DomainServices;
using Server.Infrastructure.Persistence.Repositories;
using Server.Infrastructure.Persistence.Settings;
using Server.Infrastructure.Services;
using System.Reflection;
using System.Text;

namespace Server.Infrastructure.Persistence;

internal static class Extensions
{
    private const string SqlServerSectionName = "SqlServer";
    private const string AuthSectionName = "AuthSettings";

    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        var sqlServerSettings = new SqlServerSettings();
        var section = configuration.GetRequiredSection(SqlServerSectionName);
        section.Bind(sqlServerSettings);

        var authSettings = new AuthSettings();
        section = configuration.GetRequiredSection(AuthSectionName);
        section.Bind(authSettings);

        services.AddAuth(authSettings);
        services.AddDbContext<BookBookDbContext>(x => x.UseSqlServer(sqlServerSettings.ConnectionString));
        services.AddScoped<IBookRepository, BookRepository>();
        services.AddScoped<IAuthorRepository, AuthorRepository>();
        services.AddScoped<IBookCategoryRepository, BookCategoryRepository>();
        services.AddScoped<IPublisherRepository, PublisherRepository>();
        services.AddScoped<IIdentityRepository, IdentityRepository>();
        services.AddScoped<ILibraryRepository, LibraryRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
        });

        return services;
    }

    public static void AddQueries(this IServiceCollection services, IConfiguration configuration)
    {
        var authSettings = new AuthSettings();
        var section = configuration.GetRequiredSection(AuthSectionName);
        section.Bind(authSettings);

        services.AddSingleton<ISecurityTokenService, SecurityTokenService>(_ => new SecurityTokenService(authSettings));
        services.AddAutoMapper(typeof(ViewModelProfile));
    }

    public static void AddDomainServices(this IServiceCollection services)
    {
        services.AddScoped<IIdentityDomainService, IdentityDomainService>();
    }

    private static void AddAuth(this IServiceCollection services, AuthSettings authSettings)
    {
        services.AddAuthentication(x =>
        {
            x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(x =>
            {
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = authSettings.Issuer,
                    ValidAudience = authSettings.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authSettings.Key)),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true
                };
            }
        );
        services.AddAuthorization();
    }
}