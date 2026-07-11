using RestaurantManagement.API.DTOs.Auth;

namespace RestaurantManagement.API.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
    }
}