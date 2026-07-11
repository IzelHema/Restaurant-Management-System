using RestaurantManagement.API.Models.Entities;

namespace RestaurantManagement.API.Repositories
{
    public interface IOrderRepository
    {
        Task<Order> CreateOrderAsync(Order order);
        Task<List<Order>> GetPendingOrdersAsync();

        Task<Order?> GetOrderByIdAsync(int orderId);

        Task UpdateOrderAsync(Order order);

        Task UpdateTableStatusAsync(int tableId, string status);

        Task<OrderItem?> GetOrderItemByIdAsync(int orderItemId);

        Task UpdateOrderItemAsync(OrderItem orderItem);

        Task<Order?> GetOrderWithItemsAsync(int orderId);

        Task<Order?> GetActiveOrderByTableIdAsync(int tableId);

        Task<List<Order>> GetCompletedOrdersAsync();

        Task ProcessPaymentAsync(int orderId, string paymentMode);

        Task<List<Order>> GetTodayOrdersAsync();

        Task<List<Bill>> GetPaymentHistoryAsync();

        Task<List<Order>> GetAllOrdersForAdminAsync();

        Task<int> GetTodayOrdersCountAsync();
        Task<int> GetPendingOrdersCountAsync();

        Task<int?> GetActiveOrderIdByTableAsync(int tableId);
    }
}