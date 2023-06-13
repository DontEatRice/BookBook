using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;
using Server.Infrastructure.Persistence.Repositories;

namespace Server.Infrastructure.Persistence;

internal static class Extensions
{
    private const string OptionsSectionName = "SqlServer";

    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        var options = new SqlServerOptions();
        var section = configuration.GetRequiredSection(OptionsSectionName);
        section.Bind(options);

        services.AddDbContext<BookBookDbContext>(x => x.UseSqlServer(options.ConnectionString));
        services.AddScoped<IBookRepository, BookRepository>();
        services.AddScoped<IAuthorRepository, AuthorRepository>();
        services.AddScoped<IBookCategoryRepository, BookCategoryRepository>();
        services.AddScoped<IPublisherRepository, PublisherRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}