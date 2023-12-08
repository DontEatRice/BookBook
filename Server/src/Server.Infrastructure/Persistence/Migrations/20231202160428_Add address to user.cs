using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Addaddresstouser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AddressId",
                table: "Identities",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Identities",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Identities",
                type: "float",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Identities_AddressId",
                table: "Identities",
                column: "AddressId");

            migrationBuilder.AddForeignKey(
                name: "FK_Identities_Addresses_AddressId",
                table: "Identities",
                column: "AddressId",
                principalTable: "Addresses",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Identities_Addresses_AddressId",
                table: "Identities");

            migrationBuilder.DropIndex(
                name: "IX_Identities_AddressId",
                table: "Identities");

            migrationBuilder.DropColumn(
                name: "AddressId",
                table: "Identities");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Identities");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Identities");
        }
    }
}
