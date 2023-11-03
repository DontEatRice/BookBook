using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Authorfulltext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropForeignKey(
            //    name: "FK_Reviews_Books_BookId1",
            //    table: "Reviews");

            //migrationBuilder.DropColumn(
            //    name: "BookId1",
            //    table: "Reviews");

            migrationBuilder.AddColumn<string>(
                name: "FullText",
                table: "Authors",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            //migrationBuilder.AddForeignKey(
            //    name: "FK_Reviews_Books_BookId",
            //    table: "Reviews",
            //    column: "BookId",
            //    principalTable: "Books",
            //    principalColumn: "Id",
            //    onDelete: ReferentialAction.Cascade);

            migrationBuilder.Sql(
                "IF  EXISTS (SELECT * FROM sys.fulltext_indexes fti WHERE fti.object_id = OBJECT_ID(N'[dbo].[Authors]'))\r\n" +
                    "ALTER FULLTEXT INDEX ON [dbo].[Authors] DISABLE;\r\n" +
                "GO\r\n" +
                "IF  EXISTS (SELECT * FROM sys.fulltext_indexes fti WHERE fti.object_id = OBJECT_ID(N'[dbo].[Authors]'))\r\n" +
                "BEGIN\r\n" +
                "    DROP FULLTEXT INDEX ON [dbo].[Authors];\r\n" +
                "END\r\n" +
                "GO\r\n" +
                "CREATE FULLTEXT INDEX ON dbo.Authors(FullText LANGUAGE 'POLISH') KEY INDEX PK_Authors ON FTCBooks WITH STOPLIST = OFF, CHANGE_TRACKING AUTO;",
                suppressTransaction: true
                );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropForeignKey(
            //    name: "FK_Reviews_Books_BookId",
            //    table: "Reviews");

            migrationBuilder.DropColumn(
                name: "FullText",
                table: "Authors");

            //migrationBuilder.AddColumn<Guid>(
            //    name: "BookId1",
            //    table: "Reviews",
            //    type: "uniqueidentifier",
            //    nullable: true);

            //migrationBuilder.AddForeignKey(
            //    name: "FK_Reviews_Books_BookId1",
            //    table: "Reviews",
            //    column: "BookId1",
            //    principalTable: "Books",
            //    principalColumn: "Id");
        }
    }
}
