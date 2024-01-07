using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Domain.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class AddressConfiguration : IEntityTypeConfiguration<Address>
{
    public void Configure(EntityTypeBuilder<Address> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.PostalCode)
            .IsRequired()
            .HasMaxLength(6);

        builder.Property(x => x.City)
            .IsRequired()
            .HasMaxLength(60);
        builder.HasIndex(x => x.City);

        builder.Property(x => x.Street)
            .IsRequired()
            .HasMaxLength(100);
    }
}
