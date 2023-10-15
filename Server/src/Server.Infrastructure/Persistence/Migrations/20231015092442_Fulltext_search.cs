using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Fulltext_search : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FullText",
                table: "Books",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.Sql(
                "IF  EXISTS (SELECT * FROM sys.fulltext_indexes fti WHERE fti.object_id = OBJECT_ID(N'[dbo].[Books]'))\r\n" +
                    "ALTER FULLTEXT INDEX ON [dbo].[Books] DISABLE;\r\n" +
                "GO\r\n" +
                "IF  EXISTS (SELECT * FROM sys.fulltext_indexes fti WHERE fti.object_id = OBJECT_ID(N'[dbo].[Books]'))\r\n" +
                "BEGIN\r\n" +
                "    DROP FULLTEXT INDEX ON [dbo].[Books];\r\n" +
                "END\r\n" +
                "GO\r\n" +
                "IF EXISTS (SELECT * FROM sys.fulltext_catalogs WHERE [name]='FTCBooks')\r\n" +
                "BEGIN\r\n" +
                    "DROP FULLTEXT CATALOG FTCBooks;\r\n" +
                "END\r\n" +
                "CREATE FULLTEXT CATALOG FTCBooks AS DEFAULT;\r\n" +
                "CREATE FULLTEXT INDEX ON dbo.Books(FullText LANGUAGE 'POLISH') KEY INDEX PK_Books ON FTCBooks WITH STOPLIST = OFF, CHANGE_TRACKING AUTO;",
                suppressTransaction: true
                );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FullText",
                table: "Books");

            migrationBuilder.Sql(
                "DROP FULLTEXT INDEX on dbo.Books;" +
                "DROP FULLTEXT CATALOG FTCBooks;",
                suppressTransaction: true);
        }
    }
}
