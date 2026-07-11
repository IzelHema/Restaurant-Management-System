using RestaurantManagement.API.DTOs;
using RestaurantManagement.API.Models.Entities;
using RestaurantManagement.API.Models.Enums;
using RestaurantManagement.API.Repositories;

namespace RestaurantManagement.API.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // keep all your existing methods here
        public async Task<object> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllUsersAsync();

            return users.Select(user => new
            {
                id = user.UserId,
                name = user.Name,
                email = user.Email,
                role = user.Role.ToString(),
                isActive = user.IsActive
            });
        }

        public async Task<object> AddUserAsync(CreateUserDto request)
        {
            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Password = request.Password,
                Role = Enum.Parse<UserRole>(request.Role, true),
                IsActive = request.IsActive
            };

            var created = await _userRepository.AddUserAsync(user);

            return new
            {
                id = created.UserId,
                name = created.Name,
                email = created.Email,
                role = created.Role.ToString(),
                isActive = created.IsActive
            };
        }

        public async Task<bool> UpdateUserAsync(int id, UpdateUserDto request)
        {
            var user = await _userRepository.GetUserByIdAsync(id);

            if (user == null)
                return false;

            user.Name = request.Name;
            user.Email = request.Email;
            user.Role = Enum.Parse<UserRole>(request.Role, true);
            user.IsActive = request.IsActive;

            if (!string.IsNullOrWhiteSpace(request.Password))
            {
                user.Password = request.Password;
            }

            await _userRepository.UpdateUserAsync(user);

            return true;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);

            if (user == null)
                return false;

            await _userRepository.DeleteUserAsync(id);

            return true;
        }
    }
}