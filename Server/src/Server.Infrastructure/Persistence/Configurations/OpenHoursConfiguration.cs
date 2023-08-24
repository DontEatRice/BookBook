using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Domain.Entities;

namespace Server.Infrastructure.Persistence.Configurations
{
    public class OpenHoursConfiguration : IEntityTypeConfiguration<OpenHours>
    {
        public void Configure(EntityTypeBuilder<OpenHours> builder)
        {
            builder.HasKey(x => x.Id);
        }
    }
}
