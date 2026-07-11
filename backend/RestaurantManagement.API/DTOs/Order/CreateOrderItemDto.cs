namespace RestaurantManagement.API.DTOs.Order
{
    public class CreateOrderItemDto
    {
        public int ItemId { get; set; }

        public int Quantity { get; set; }
    }
}