using Microsoft.EntityFrameworkCore;
using Server.Domain.Entities;

namespace Server.Infrastructure.Persistence;

internal sealed class BookBookDbContext : DbContext
{
    public DbSet<Author> Authors { get; set; }
    public DbSet<Book> Books { get; set; }
    public DbSet<BookCategory> BookCategories { get; set; }
    public DbSet<Publisher> Publishers { get; set; }

    public BookBookDbContext(DbContextOptions<BookBookDbContext> options) : base(options)
    {
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(GetType().Assembly);
    }
}