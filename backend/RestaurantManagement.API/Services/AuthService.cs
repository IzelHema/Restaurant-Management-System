using RestaurantManagement.API.DTOs.Auth;
using RestaurantManagement.API.Repositories;

namespace RestaurantManagement.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
        {
            var user = await _userRepository.GetUserByEmailAsync(request.Email);

            if (user == null)
            {
                return new LoginResponseDto
                {
                    Success = false,
                    Message = "User not found"
                };
            }

            if (user.Password != request.Password)
            {
                return new LoginResponseDto
                {
                    Success = false,
                    Message = "Invalid password"
                };
            }

            if (!user.IsActive)
            {
                return new LoginResponseDto
                {
                    Success = false,
                    Message = "User is inactive"
                };
            }

            return new LoginResponseDto
            {
                Success = true,
                Message = "Login successful",

                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role.ToString()
            };
        }
    }
}