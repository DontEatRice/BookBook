using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Domain.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class BookConfiguration : IEntityTypeConfiguration<Book>
{
    public void Configure(EntityTypeBuilder<Book> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.ISBN)
            .IsRequired()
            .HasMaxLength(17);
        builder.HasIndex(x => x.ISBN).IsUnique();

        builder.Property(x => x.Title)
            .IsRequired();
        builder.HasIndex(x => x.Title);

        builder.Property(x => x.YearPublished)
            .IsRequired();
        builder.HasIndex(x => x.YearPublished);

        builder.Property(x => x.AverageRating);
        builder.HasIndex(x => x.AverageRating);

        builder.Property(x => x.AverageCriticRating);
        builder.HasIndex(x => x.AverageCriticRating);

        builder.HasMany(x => x.UserBooks).WithOne(x => x.Book).HasForeignKey(x => x.BookId);
    }
}