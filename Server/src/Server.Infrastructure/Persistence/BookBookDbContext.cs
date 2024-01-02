using Microsoft.EntityFrameworkCore;
using Server.Domain.Entities;
using Server.Domain.Entities.Auth;
using Server.Domain.Entities.Reservations;
using Server.Domain.Entities.User;

namespace Server.Infrastructure.Persistence;

internal sealed class BookBookDbContext : DbContext
{
    public DbSet<Author> Authors { get; set; }
    public DbSet<Book> Books { get; set; }
    public DbSet<BookCategory> BookCategories { get; set; }
    public DbSet<Publisher> Publishers { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Identity> Identities { get; set; }
    public DbSet<Session> Sessions { get; set; }
    public DbSet<Library> Libraries { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<OpenHours> OpenHours { get; set; }
    public DbSet<Image> Images { get; set; }
    public DbSet<LibraryBook> LibraryBooks { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<UserBook> UserBooks { get; set; }
    public DbSet<Follows> Follows { get; set; }

    public BookBookDbContext(DbContextOptions<BookBookDbContext> options) : base(options)
    {
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(GetType().Assembly);
    }
}