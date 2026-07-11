using RestaurantManagement.API.DTOs;

namespace RestaurantManagement.API.Services
{
    public interface ITableService
    {
        Task<List<object>> GetAllTablesAsync();

        Task<object> GetTableAssignmentsAsync();
        Task<bool> AssignWaiterAsync(int tableId, int? waiterId);

        Task<object> GetTablesByWaiterIdAsync(int waiterId);
        Task<object> AddTableAsync(CreateTableDto request);
        Task<bool> UpdateTableAsync(int id, UpdateTableDto request);

    }
}