using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace sxkiev.Migrations
{
    /// <inheritdoc />
    public partial class addplans : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Profiles",
                newName: "PlanId");

            migrationBuilder.CreateTable(
                name: "ProfilePlans",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Price = table.Column<int>(type: "integer", nullable: false),
                    Duration = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfilePlans", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Profiles_PlanId",
                table: "Profiles",
                column: "PlanId");

            migrationBuilder.AddForeignKey(
                name: "FK_Profiles_ProfilePlans_PlanId",
                table: "Profiles",
                column: "PlanId",
                principalTable: "ProfilePlans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Profiles_ProfilePlans_PlanId",
                table: "Profiles");

            migrationBuilder.DropTable(
                name: "ProfilePlans");

            migrationBuilder.DropIndex(
                name: "IX_Profiles_PlanId",
                table: "Profiles");

            migrationBuilder.RenameColumn(
                name: "PlanId",
                table: "Profiles",
                newName: "Type");
        }
    }
}
