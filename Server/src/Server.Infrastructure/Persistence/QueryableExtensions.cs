using System.Linq.Expressions;
using System.Reflection;
using Microsoft.EntityFrameworkCore;

namespace Server.Infrastructure.Persistence;

public static class QueryableExtensions
{
    public static async Task<List<TEntity>> ToListWithOffsetAsync<TEntity>(
        this IQueryable<TEntity> queryable,
        int offset,
        int limit,
        CancellationToken cancellationToken)
        where TEntity : class
    {
        if (queryable == null)
            throw new ArgumentNullException(nameof(queryable));

        if (offset < 0)
            throw new ArgumentOutOfRangeException(nameof(offset), "Offset cannot be negative.");

        if (limit <= 0)
            throw new ArgumentOutOfRangeException(nameof(limit), "Count must be greater than zero.");

        return await queryable.Skip(offset).Take(limit).ToListAsync(cancellationToken);
    }
    
    /// <summary>
    /// Order by property that is named like <paramref name="orderByProperty"/>
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <param name="source"></param>
    /// <param name="orderByProperty"></param>
    /// <returns></returns>
    public static IOrderedQueryable<TEntity> OrderBy<TEntity>(this IQueryable<TEntity> source, string orderByProperty)
    {
        ArgumentException.ThrowIfNullOrEmpty(orderByProperty, nameof(orderByProperty));

        return (IOrderedQueryable<TEntity>)source.Provider.CreateQuery<TEntity>(
                CreateMethodCall(source, orderByProperty, "OrderBy")
            );
    }

    /// <summary>
    /// Order by descending by property that is named like <paramref name="orderByProperty"/>
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <param name="source"></param>
    /// <param name="orderByProperty"></param>
    /// <returns></returns>
    public static IOrderedQueryable<TEntity> OrderByDescending<TEntity>(this IQueryable<TEntity> source, string orderByProperty)
    {
        ArgumentException.ThrowIfNullOrEmpty(orderByProperty, nameof(orderByProperty));

        return (IOrderedQueryable<TEntity>)source.Provider.CreateQuery<TEntity>(
                CreateMethodCall(source, orderByProperty, "OrderByDescending")
            );
    }

    /// <summary>
    /// Then by descending by property that is named like <paramref name="orderByProperty"/>
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <param name="source"></param>
    /// <param name="orderByProperty"></param>
    /// <returns></returns>
    public static IOrderedQueryable<TEntity> ThenByDescending<TEntity>(this IQueryable<TEntity> source, string orderByProperty)
    {
        ArgumentException.ThrowIfNullOrEmpty(orderByProperty, nameof(orderByProperty));

        return (IOrderedQueryable<TEntity>)source.Provider.CreateQuery<TEntity>(
                CreateMethodCall(source, orderByProperty, "ThenByDescending")
            );
    }
    
    /// <summary>
    /// Then by property that is named like <paramref name="orderByProperty"/>
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <param name="source"></param>
    /// <param name="orderByProperty"></param>
    /// <returns></returns>
    public static IOrderedQueryable<TEntity> ThenBy<TEntity>(this IQueryable<TEntity> source, string orderByProperty)
    {
        ArgumentException.ThrowIfNullOrEmpty(orderByProperty, nameof(orderByProperty));

        return (IOrderedQueryable<TEntity>)source.Provider.CreateQuery<TEntity>(
            CreateMethodCall(source, orderByProperty, "ThenBy")
        );
    }
    
    private static MethodCallExpression CreateMethodCall<TEntity>(IQueryable<TEntity> source, string prop, string command)
    {
        var type = typeof(TEntity);
        var property = GetProperty(type, prop);
        var parameter = Expression.Parameter(type, "p");
        var propertyAccess = Expression.MakeMemberAccess(parameter, property);
        var orderByExpression = Expression.Lambda(propertyAccess, parameter);
        var resultExpression = Expression.Call(typeof(Queryable), command, new[] { type, property.PropertyType },
            source.Expression, Expression.Quote(orderByExpression));
        return resultExpression;
    }
    
    private static PropertyInfo GetProperty(Type type, string propertyName)
    {
        ArgumentException.ThrowIfNullOrEmpty(propertyName, nameof(propertyName));

        var match = type.GetProperty(propertyName);
        if (match is not null)
        {
            return match;
        }
        //Search for property that in camelCase matches the propertyname
        var nameToLower = propertyName.ToLower();
        foreach (var property in type.GetProperties())
        {
            // var camelCase = System.Text.Json.JsonNamingPolicy.CamelCase.ConvertName(property.Name);
            if (nameToLower == property.Name.ToLower())
            {
                return property;
            }
        }

        throw new ArgumentException($"There was not public property named {propertyName} found on {type.Name}");
    }
}