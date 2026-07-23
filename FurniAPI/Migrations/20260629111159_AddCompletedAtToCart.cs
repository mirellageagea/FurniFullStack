using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FurniAPI.Migrations
{
    public partial class AddCompletedAtToCart : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CompletedAt",
                table: "Carts",
                type: "datetime2",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompletedAt",
                table: "Carts");
        }
    }
}
