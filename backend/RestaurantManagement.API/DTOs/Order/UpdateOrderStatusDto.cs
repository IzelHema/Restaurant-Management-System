using RestaurantManagement.API.Models.Enums;

namespace RestaurantManagement.API.DTOs.Order
{
    public class UpdateOrderStatusDto
    {
        public OrderStatus OrderStatus { get; set; }
    }
}