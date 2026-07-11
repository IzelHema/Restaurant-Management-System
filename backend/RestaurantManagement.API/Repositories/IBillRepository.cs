namespace RestaurantManagement.API.Repositories
{
    public interface IBillRepository
    {
        Task<decimal> GetTodayRevenueAsync();
    }
}
