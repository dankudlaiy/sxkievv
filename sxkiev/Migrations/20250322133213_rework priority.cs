using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace sxkiev.Migrations
{
    /// <inheritdoc />
    public partial class reworkpriority : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Priority",
                table: "Profiles",
                newName: "Type");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Profiles",
                newName: "Priority");
        }
    }
}
