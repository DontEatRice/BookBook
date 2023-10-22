using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Userbooklist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BookIdentity",
                columns: table => new
                {
                    BooksObservedId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UsersObservingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookIdentity", x => new { x.BooksObservedId, x.UsersObservingId });
                    table.ForeignKey(
                        name: "FK_BookIdentity_Books_BooksObservedId",
                        column: x => x.BooksObservedId,
                        principalTable: "Books",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookIdentity_Identities_UsersObservingId",
                        column: x => x.UsersObservingId,
                        principalTable: "Identities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BookIdentity_UsersObservingId",
                table: "BookIdentity",
                column: "UsersObservingId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookIdentity");
        }
    }
}
