using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ReservationBookForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ReservationBook_BookId",
                table: "ReservationBook",
                column: "BookId");

            migrationBuilder.AddForeignKey(
                name: "FK_ReservationBook_Books_BookId",
                table: "ReservationBook",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReservationBook_Books_BookId",
                table: "ReservationBook");

            migrationBuilder.DropIndex(
                name: "IX_ReservationBook_BookId",
                table: "ReservationBook");
        }
    }
}
