using RestaurantManagement.API.Models.Entities;

namespace RestaurantManagement.API.Repositories
{
    public interface ITableRepository
    {
        Task<List<RestaurantTable>> GetAllTablesAsync();

        Task<List<RestaurantTable>> GetTableAssignmentsAsync();

        Task AssignWaiterAsync(int tableId, int? waiterId);

        Task<List<RestaurantTable>> GetTablesByWaiterIdAsync(int waiterId);

        Task<RestaurantTable> AddTableAsync(RestaurantTable table);

        Task<RestaurantTable?> GetTableByIdAsync(int id);

        Task UpdateTableAsync(RestaurantTable table);

        Task<int> GetActiveTablesCountAsync();

    }
}