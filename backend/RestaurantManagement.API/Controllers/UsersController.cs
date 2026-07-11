using Microsoft.AspNetCore.Mvc;
using RestaurantManagement.API.DTOs;
using RestaurantManagement.API.Services;

namespace RestaurantManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpPost]
        public async Task<IActionResult> AddUser(CreateUserDto request)
        {
            try
            {
                var user = await _userService.AddUserAsync(request);
                return Ok(user);
            }
            catch (ArgumentException)
            {
                return BadRequest(new
                {
                    message = "Invalid role. Use Admin, Waiter, Kitchen, or Cashier."
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(
            int id,
            UpdateUserDto request)
        {
            try
            {
                var updated = await _userService.UpdateUserAsync(id, request);

                if (!updated)
                    return NotFound(new { message = "User not found." });

                return Ok(new
                {
                    message = "User updated successfully."
                });
            }
            catch (ArgumentException)
            {
                return BadRequest(new
                {
                    message = "Invalid role. Use Admin, Waiter, Kitchen, or Cashier."
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var deleted = await _userService.DeleteUserAsync(id);

            if (!deleted)
                return NotFound(new { message = "User not found." });

            return Ok(new
            {
                message = "User deleted successfully."
            });
        }
    }
}