namespace RestaurantManagement.API.Services
{
    public interface IReportService
    {
        Task<object> GetSummaryAsync();
    }
}