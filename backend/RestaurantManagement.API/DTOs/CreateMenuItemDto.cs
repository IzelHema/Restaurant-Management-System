namespace RestaurantManagement.API.DTOs
{
    public class CreateMenuItemDto
    {
        public string ItemName { get; set; } = string.Empty;

        public int CategoryId { get; set; }

        public decimal Price { get; set; }

        public bool IsAvailable { get; set; } = true;
    }
}