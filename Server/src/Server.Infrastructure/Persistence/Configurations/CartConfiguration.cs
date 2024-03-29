using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Domain.Entities.Reservations;

namespace Server.Infrastructure.Persistence.Configurations;

public class CartConfiguration : IEntityTypeConfiguration<Cart>
{
    public void Configure(EntityTypeBuilder<Cart> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.Identity).WithOne().HasForeignKey<Cart>(x => x.UserId);

        builder.OwnsMany(x => x.CartItems);

        builder.HasIndex(x => x.UserId);
    }
}