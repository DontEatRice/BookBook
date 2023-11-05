using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AuthorFullText : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FullText",
                table: "Authors",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

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
            migrationBuilder.DropColumn(
                name: "FullText",
                table: "Authors");

            migrationBuilder.Sql(
                "DROP FULLTEXT INDEX ON dbo.Authors;", suppressTransaction: true);
        }
    }
}
