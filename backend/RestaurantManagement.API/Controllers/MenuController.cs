using Microsoft.AspNetCore.Mvc;
using RestaurantManagement.API.Services;
using RestaurantManagement.API.DTOs;

namespace RestaurantManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuController : ControllerBase
    {
        private readonly IMenuService _menuService;

        public MenuController(IMenuService menuService)
        {
            _menuService = menuService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMenu()
        {
            return Ok(await _menuService.GetMenuItemsAsync());
        }


        [HttpPost]
        public async Task<IActionResult> AddMenuItem(CreateMenuItemDto request)
        {
            var item = await _menuService.AddMenuItemAsync(request);
            return Ok(item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMenuItem(int id, UpdateMenuItemDto request)
        {
            var updated = await _menuService.UpdateMenuItemAsync(id, request);

            if (!updated)
                return NotFound();

            return Ok(new { message = "Menu item updated successfully." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenuItem(int id)
        {
            var deleted = await _menuService.DeleteMenuItemAsync(id);

            if (!deleted)
                return NotFound();

            return Ok(new { message = "Menu item deleted successfully." });
        }


        [HttpGet("admin")]
        public async Task<IActionResult> GetAllMenuItemsForAdmin()
        {
            var items = await _menuService.GetAllMenuItemsAsync();
            return Ok(items);
        }
    }
}