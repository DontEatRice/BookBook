using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Domain.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class ReviewConfiguration  : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .HasMaxLength(250);

        builder.Property(x => x.Description);

        builder.Property(x => x.Rating)
            .IsRequired();

        builder.HasIndex(x => x.UserId);

        builder.HasIndex(x => x.BookId);
    }
}