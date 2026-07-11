using RestaurantManagement.API.Repositories;
using RestaurantManagement.API.DTOs;
using RestaurantManagement.API.Models.Entities;

namespace RestaurantManagement.API.Services
{
    public class MenuService : IMenuService
    {
        private readonly IMenuRepository _menuRepository;

        public MenuService(IMenuRepository menuRepository)
        {
            _menuRepository = menuRepository;
        }

        public async Task<List<object>> GetMenuItemsAsync()
        {
            var items = await _menuRepository.GetMenuItemsAsync();

            return items.Select(item => new
            {
                id = item.MenuItemId,
                name = item.ItemName,
                price = item.Price,
                categoryId = item.CategoryId,
                category = item.MenuCategory != null
                ? item.MenuCategory.CategoryName
                : "",
                isAvailable = item.IsAvailable

            }).Cast<object>().ToList();
        }

        public async Task<object> AddMenuItemAsync(CreateMenuItemDto request)
        {
            var item = new MenuItem
            {
                ItemName = request.ItemName,
                CategoryId = request.CategoryId,
                Price = request.Price,
                IsAvailable = request.IsAvailable
            };

            var created = await _menuRepository.AddMenuItemAsync(item);

            return new
            {
                id = created.MenuItemId,
                name = created.ItemName,
                price = created.Price,
                categoryId = created.CategoryId,
                isAvailable = created.IsAvailable
            };
        }

        public async Task<bool> UpdateMenuItemAsync(int id, UpdateMenuItemDto request)
        {
            var item = await _menuRepository.GetMenuItemByIdAsync(id);

            if (item == null)
                return false;

            item.ItemName = request.ItemName;
            item.CategoryId = request.CategoryId;
            item.Price = request.Price;
            item.IsAvailable = request.IsAvailable;

            await _menuRepository.UpdateMenuItemAsync(item);

            return true;
        }

        public async Task<bool> DeleteMenuItemAsync(int id)
        {
            var item = await _menuRepository.GetMenuItemByIdAsync(id);

            if (item == null)
                return false;

            await _menuRepository.DeleteMenuItemAsync(id);

            return true;
        }

        public async Task<object> GetAllMenuItemsAsync()
        {
            var items = await _menuRepository.GetAllMenuItemsAsync();

            return items.Select(item => new
            {
                id = item.MenuItemId,
                name = item.ItemName,
                price = item.Price,
                categoryId = item.CategoryId,
                category = item.MenuCategory != null
                    ? item.MenuCategory.CategoryName
                    : "",
                isAvailable = item.IsAvailable
            });
        }
    }
}