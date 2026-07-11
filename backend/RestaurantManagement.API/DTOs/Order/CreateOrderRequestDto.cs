namespace RestaurantManagement.API.DTOs.Order
{
    public class CreateOrderRequestDto
    {
        public int TableId { get; set; }

        public int WaiterId { get; set; }

        public List<CreateOrderItemDto> Items { get; set; } = new();
    }
}