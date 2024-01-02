using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Server.Domain.Entities;
using Server.Domain.Entities.Auth;

namespace Server.Infrastructure.Persistence.Configurations;

public class IdentityConfiguration : IEntityTypeConfiguration<Identity>
{
    public void Configure(EntityTypeBuilder<Identity> builder)
    {
        builder.OwnsMany(i => i.Sessions).ToTable("sessions");
        //builder
        //    .Property(x => x.Roles)
        //    .HasConversion(new ValueConverter<List<string>, string>(
        //        v => JsonSerializer.Serialize(v, new JsonSerializerOptions(JsonSerializerOptions.Default)),
        //        v => JsonSerializer.Deserialize<List<string>>(v,
        //            new JsonSerializerOptions(JsonSerializerDefaults.General)) ?? new List<string>()));

        builder.Property(e => e.AvatarImageUrl).HasMaxLength(300);
        builder.HasIndex(i => i.Email).IsUnique();

        builder.HasMany(x => x.UserBooks).WithOne(x => x.User).HasForeignKey(x =>  x.UserId);
        builder.HasMany(x => x.Followers).WithMany(x => x.Followed).UsingEntity<Follows>(
            right => right.HasOne(f => f.Follower).WithMany().HasForeignKey(f => f.FollowerId),
            right => right.HasOne(f => f.Followed).WithMany().HasForeignKey(f => f.FollowedId));
    }
}