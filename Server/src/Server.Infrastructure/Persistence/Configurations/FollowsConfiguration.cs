using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Server.Domain.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class FollowsConfiguration : IEntityTypeConfiguration<Follows>
{
    public void Configure(EntityTypeBuilder<Follows> builder)
    {
        builder.HasIndex(x => x.FollowerId);

        builder.HasIndex(x => x.FollowedId);
    }
}