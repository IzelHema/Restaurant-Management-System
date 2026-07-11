using RestaurantManagement.API.Models.Enums;

namespace RestaurantManagement.API.DTOs.Order
{
    public class UpdateOrderItemStatusDto
    {
        public KitchenStatus KitchenStatus { get; set; }
    }
}