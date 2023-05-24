using Microsoft.EntityFrameworkCore;
using Server.Domain.Entities;

namespace Server.Infrastructure.Persistence;

internal sealed class BookBookDbContext : DbContext
{
    public DbSet<Book> Books { get; set; }

    public BookBookDbContext(DbContextOptions<BookBookDbContext> options) : base(options)
    {
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(GetType().Assembly);
    }
}