using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Test : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Carts_UserId",
                table: "Carts");

            migrationBuilder.CreateIndex(
                name: "IX_Carts_UserId",
                table: "Carts",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CartBook_BookId",
                table: "CartBook",
                column: "BookId");

            migrationBuilder.CreateIndex(
                name: "IX_CartBook_LibraryId",
                table: "CartBook",
                column: "LibraryId");

            migrationBuilder.AddForeignKey(
                name: "FK_CartBook_Books_BookId",
                table: "CartBook",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CartBook_Libraries_LibraryId",
                table: "CartBook",
                column: "LibraryId",
                principalTable: "Libraries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Carts_Identities_UserId",
                table: "Carts",
                column: "UserId",
                principalTable: "Identities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Identities_UserId",
                table: "Reservations",
                column: "UserId",
                principalTable: "Identities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Libraries_LibraryId",
                table: "Reservations",
                column: "LibraryId",
                principalTable: "Libraries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CartBook_Books_BookId",
                table: "CartBook");

            migrationBuilder.DropForeignKey(
                name: "FK_CartBook_Libraries_LibraryId",
                table: "CartBook");

            migrationBuilder.DropForeignKey(
                name: "FK_Carts_Identities_UserId",
                table: "Carts");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Identities_UserId",
                table: "Reservations");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Libraries_LibraryId",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Carts_UserId",
                table: "Carts");

            migrationBuilder.DropIndex(
                name: "IX_CartBook_BookId",
                table: "CartBook");

            migrationBuilder.DropIndex(
                name: "IX_CartBook_LibraryId",
                table: "CartBook");

            migrationBuilder.CreateIndex(
                name: "IX_Carts_UserId",
                table: "Carts",
                column: "UserId");
        }
    }
}
