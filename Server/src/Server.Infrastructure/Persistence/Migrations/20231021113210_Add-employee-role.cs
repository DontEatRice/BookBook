using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Addemployeerole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "LibraryId",
                table: "Identities",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Identities_LibraryId",
                table: "Identities",
                column: "LibraryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Identities_Libraries_LibraryId",
                table: "Identities",
                column: "LibraryId",
                principalTable: "Libraries",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Identities_Libraries_LibraryId",
                table: "Identities");

            migrationBuilder.DropIndex(
                name: "IX_Identities_LibraryId",
                table: "Identities");

            migrationBuilder.DropColumn(
                name: "LibraryId",
                table: "Identities");
        }
    }
}
