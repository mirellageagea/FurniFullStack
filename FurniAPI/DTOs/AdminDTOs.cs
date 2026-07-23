namespace FurniAPI.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalOrders { get; set; }
        public int TotalUsers { get; set; }
        public double TotalRevenue { get; set; }
        public int TotalProducts { get; set; }
        public int TotalCoupons { get; set; }
        public List<DailySummaryDto> DailySummary { get; set; } = new();
    }

    public class DailySummaryDto
    {
        public DateTime? Date { get; set; }
        public int Orders { get; set; }
        public double Revenue { get; set; }
    }

    public class AdminUserReadDto
    {
        public string Id { get; set; } = string.Empty;
        public string? Email { get; set; }
        public List<string> Roles { get; set; } = new();
    }
}
