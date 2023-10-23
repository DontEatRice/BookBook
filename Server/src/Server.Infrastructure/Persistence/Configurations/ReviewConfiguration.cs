using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Domain.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class ReviewConfiguration
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .HasMaxLength(250);

        builder.Property(x => x.Description)
            .IsRequired();

        builder.Property(x => x.Rating)
            .IsRequired();
    }
}