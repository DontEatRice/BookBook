using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Domain.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class LibraryBookConfiguration : IEntityTypeConfiguration<LibraryBook>
{
    public void Configure(EntityTypeBuilder<LibraryBook> builder)
    {
        builder.HasKey(x => new { x.LibraryId, x.BookId });
    }
}
