using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ChangeRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Roles",
                table: "Identities");

            migrationBuilder.AddColumn<int>(
                name: "Role",
                table: "Identities",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "Identities");

            migrationBuilder.AddColumn<string>(
                name: "Roles",
                table: "Identities",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
