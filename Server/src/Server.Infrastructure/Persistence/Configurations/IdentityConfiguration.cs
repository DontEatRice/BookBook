using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Server.Domain.Entities.Auth;

namespace Server.Infrastructure.Persistence.Configurations;

public class IdentityConfiguration : IEntityTypeConfiguration<Identity>
{
    public void Configure(EntityTypeBuilder<Identity> builder)
    {
        builder.OwnsMany(i => i.Sessions).ToTable("sessions");
        builder
            .Property(x => x.Roles)
            .HasConversion(new ValueConverter<List<string>, string>(
                v => JsonSerializer.Serialize(v, new JsonSerializerOptions(JsonSerializerOptions.Default)),
                v => JsonSerializer.Deserialize<List<string>>(v,
                    new JsonSerializerOptions(JsonSerializerDefaults.General)) ?? new List<string>()));

        builder.Property(e => e.AvatarImageUrl).HasMaxLength(300).IsRequired(false);
        builder.HasIndex(i => i.Email).IsUnique();

        builder.HasMany(x => x.UserBooks).WithOne(x => x.User).HasForeignKey(x =>  x.UserId);
    }
}