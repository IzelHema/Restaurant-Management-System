using RestaurantManagement.API.DTOs;

namespace RestaurantManagement.API.Services
{
    public interface IUserService
    {
       

    Task<object> GetAllUsersAsync();
    Task<object> AddUserAsync(CreateUserDto request);
    Task<bool> UpdateUserAsync(int id, UpdateUserDto request);
    Task<bool> DeleteUserAsync(int id);
}
}
