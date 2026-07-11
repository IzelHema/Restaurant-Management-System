using RestaurantManagement.API.DTOs.Order;

namespace RestaurantManagement.API.Services
{
    public interface IOrderService
    {
        Task<int> CreateOrderAsync(CreateOrderRequestDto request);

        Task<List<object>> GetPendingOrdersAsync();

        Task<bool> UpdateOrderStatusAsync(int orderId, UpdateOrderStatusDto request);

        Task<bool> UpdateOrderItemStatusAsync(int orderItemId, UpdateOrderItemStatusDto request);

        Task<object?> GetOrderByIdAsync(int orderId);

        Task<bool> MarkOrderItemServedAsync(int orderItemId);

        Task<bool> CompleteOrderAsync(int orderId);

        Task<object> GetCompletedOrdersAsync();

        Task ProcessPaymentAsync(int orderId, string paymentMode);

        Task<object> GetTodayOrdersAsync();

        Task<object> GetPaymentHistoryAsync();

        Task<object> GetAllOrdersForAdminAsync();
    }
}