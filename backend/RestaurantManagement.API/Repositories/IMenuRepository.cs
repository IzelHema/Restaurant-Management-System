using RestaurantManagement.API.Models.Entities;

namespace RestaurantManagement.API.Repositories
{
    public interface IMenuRepository
    {
        Task<List<MenuItem>> GetMenuItemsAsync();

        Task<MenuItem> AddMenuItemAsync(MenuItem item);

        Task UpdateMenuItemAsync(MenuItem item);

        Task DeleteMenuItemAsync(int id);

        Task<MenuItem?> GetMenuItemByIdAsync(int id);

        Task<List<MenuItem>> GetAllMenuItemsAsync();
    }
}