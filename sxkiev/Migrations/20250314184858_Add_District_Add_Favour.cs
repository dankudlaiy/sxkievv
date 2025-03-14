using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace sxkiev.Migrations
{
    /// <inheritdoc />
    public partial class Add_District_Add_Favour : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Apartment",
                table: "Profiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<double>(
                name: "HourPrice",
                table: "Profiles",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "NightPrice",
                table: "Profiles",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<bool>(
                name: "ToClient",
                table: "Profiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<double>(
                name: "TwoHourPrice",
                table: "Profiles",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.CreateTable(
                name: "ProfileDistrict",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    District = table.Column<int>(type: "integer", nullable: false),
                    ProfileId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfileDistrict", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfileDistrict_Profiles_ProfileId",
                        column: x => x.ProfileId,
                        principalTable: "Profiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProfileFavour",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Favour = table.Column<int>(type: "integer", nullable: false),
                    ProfileId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfileFavour", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfileFavour_Profiles_ProfileId",
                        column: x => x.ProfileId,
                        principalTable: "Profiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProfileDistrict_ProfileId",
                table: "ProfileDistrict",
                column: "ProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfileFavour_ProfileId",
                table: "ProfileFavour",
                column: "ProfileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProfileDistrict");

            migrationBuilder.DropTable(
                name: "ProfileFavour");

            migrationBuilder.DropColumn(
                name: "Apartment",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "HourPrice",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "NightPrice",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "ToClient",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "TwoHourPrice",
                table: "Profiles");
        }
    }
}
