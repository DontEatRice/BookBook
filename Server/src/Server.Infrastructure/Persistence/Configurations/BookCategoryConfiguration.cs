using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Domain.Entities;

namespace Server.Infrastructure.Persistence.Configurations
{
    public class BookCategoryConfiguration : IEntityTypeConfiguration<BookCategory>
    {
        public void Configure(EntityTypeBuilder<BookCategory> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name).HasMaxLength(40);

            builder.HasIndex(x => x.Name).IsUnique();

            builder.HasMany<Book>().WithMany();

        }
    }
}
