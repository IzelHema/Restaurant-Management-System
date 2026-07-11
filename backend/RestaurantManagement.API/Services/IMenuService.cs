using RestaurantManagement.API.DTOs;

namespace RestaurantManagement.API.Services
{
    public interface IMenuService
    {
        Task<List<object>> GetMenuItemsAsync();

        Task<object> AddMenuItemAsync(CreateMenuItemDto request);

        Task<bool> UpdateMenuItemAsync(int id, UpdateMenuItemDto request);

        Task<bool> DeleteMenuItemAsync(int id);

        Task<object> GetAllMenuItemsAsync();
    }
}