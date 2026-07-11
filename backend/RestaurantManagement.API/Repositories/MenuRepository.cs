using Microsoft.EntityFrameworkCore;
using RestaurantManagement.API.Models;
using RestaurantManagement.API.Models.Entities;

namespace RestaurantManagement.API.Repositories
{
    public class MenuRepository : IMenuRepository
    {
        private readonly RestaurantManagementDbContext _context;

        public MenuRepository(RestaurantManagementDbContext context)
        {
            _context = context;
        }

        public async Task<List<MenuItem>> GetMenuItemsAsync()
        {
            return await _context.MenuItems
                .Include(m => m.MenuCategory)
                .Where(m => m.IsAvailable)
                .OrderBy(m => m.MenuCategory.CategoryName)
                .ThenBy(m => m.ItemName)
                .ToListAsync();
        }

        public async Task<MenuItem> AddMenuItemAsync(MenuItem item)
        {
            _context.MenuItems.Add(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<MenuItem?> GetMenuItemByIdAsync(int id)
        {
            return await _context.MenuItems.FindAsync(id);
        }

        public async Task UpdateMenuItemAsync(MenuItem item)
        {
            _context.MenuItems.Update(item);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteMenuItemAsync(int id)
        {
            var item = await _context.MenuItems.FindAsync(id);

            if (item != null)
            {
                _context.MenuItems.Remove(item);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<MenuItem>> GetAllMenuItemsAsync()
        {
            return await _context.MenuItems
                .Include(m => m.MenuCategory)
                .OrderBy(m => m.CategoryId)
                .ThenBy(m => m.ItemName)
                .ToListAsync();
        }
    }
}