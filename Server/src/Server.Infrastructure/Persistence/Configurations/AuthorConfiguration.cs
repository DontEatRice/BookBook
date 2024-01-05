using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Domain.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class AuthorConfiguration : IEntityTypeConfiguration<Author>
{
    public void Configure(EntityTypeBuilder<Author> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.FirstName)
            .IsRequired().
            HasMaxLength(40);
        builder.HasIndex(x => x.FirstName);

        builder.Property(x => x.LastName)
            .IsRequired().
            HasMaxLength(50);
        builder.HasIndex(x => x.LastName);

        builder.Property(x => x.BirthYear)
            .IsRequired();
        builder.HasIndex(x => x.BirthYear);

        builder.Property(x => x.ProfilePictureUrl)
            .IsRequired(false)
            .HasMaxLength(256);
    }
}