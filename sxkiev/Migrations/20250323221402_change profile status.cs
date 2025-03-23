using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace sxkiev.Migrations
{
    /// <inheritdoc />
    public partial class changeprofilestatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "IsBanned",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "IsRejected",
                table: "Profiles");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Profiles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "ProfileActions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "ProfileActions");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Profiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsBanned",
                table: "Profiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsRejected",
                table: "Profiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
