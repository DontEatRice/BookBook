using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Indexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "RefreshTokenHash",
                table: "sessions",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Books",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_sessions_RefreshTokenHash",
                table: "sessions",
                column: "RefreshTokenHash");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_CreatedAt",
                table: "Reservations",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_LibraryId",
                table: "Reservations",
                column: "LibraryId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_ReservationEndDate",
                table: "Reservations",
                column: "ReservationEndDate");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_Status",
                table: "Reservations",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_UserId",
                table: "Reservations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Libraries_Name",
                table: "Libraries",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Identities_IsCritic",
                table: "Identities",
                column: "IsCritic");

            migrationBuilder.CreateIndex(
                name: "IX_Identities_Role",
                table: "Identities",
                column: "Role");

            migrationBuilder.CreateIndex(
                name: "IX_Follows_FollowedId",
                table: "Follows",
                column: "FollowedId");

            migrationBuilder.CreateIndex(
                name: "IX_Carts_UserId",
                table: "Carts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Books_AverageCriticRating",
                table: "Books",
                column: "AverageCriticRating");

            migrationBuilder.CreateIndex(
                name: "IX_Books_AverageRating",
                table: "Books",
                column: "AverageRating");

            migrationBuilder.CreateIndex(
                name: "IX_Books_Title",
                table: "Books",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_Books_YearPublished",
                table: "Books",
                column: "YearPublished");

            migrationBuilder.CreateIndex(
                name: "IX_Authors_BirthYear",
                table: "Authors",
                column: "BirthYear");

            migrationBuilder.CreateIndex(
                name: "IX_Authors_FirstName",
                table: "Authors",
                column: "FirstName");

            migrationBuilder.CreateIndex(
                name: "IX_Authors_LastName",
                table: "Authors",
                column: "LastName");

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_City",
                table: "Addresses",
                column: "City");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_sessions_RefreshTokenHash",
                table: "sessions");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_CreatedAt",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_LibraryId",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_ReservationEndDate",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_Status",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_UserId",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Libraries_Name",
                table: "Libraries");

            migrationBuilder.DropIndex(
                name: "IX_Identities_IsCritic",
                table: "Identities");

            migrationBuilder.DropIndex(
                name: "IX_Identities_Role",
                table: "Identities");

            migrationBuilder.DropIndex(
                name: "IX_Follows_FollowedId",
                table: "Follows");

            migrationBuilder.DropIndex(
                name: "IX_Carts_UserId",
                table: "Carts");

            migrationBuilder.DropIndex(
                name: "IX_Books_AverageCriticRating",
                table: "Books");

            migrationBuilder.DropIndex(
                name: "IX_Books_AverageRating",
                table: "Books");

            migrationBuilder.DropIndex(
                name: "IX_Books_Title",
                table: "Books");

            migrationBuilder.DropIndex(
                name: "IX_Books_YearPublished",
                table: "Books");

            migrationBuilder.DropIndex(
                name: "IX_Authors_BirthYear",
                table: "Authors");

            migrationBuilder.DropIndex(
                name: "IX_Authors_FirstName",
                table: "Authors");

            migrationBuilder.DropIndex(
                name: "IX_Authors_LastName",
                table: "Authors");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_City",
                table: "Addresses");

            migrationBuilder.AlterColumn<string>(
                name: "RefreshTokenHash",
                table: "sessions",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Books",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
