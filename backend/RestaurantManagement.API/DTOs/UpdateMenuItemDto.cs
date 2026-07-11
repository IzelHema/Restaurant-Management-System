namespace RestaurantManagement.API.DTOs
{
    public class UpdateMenuItemDto
    {
        public string ItemName { get; set; } = string.Empty;

        public int CategoryId { get; set; }

        public decimal Price { get; set; }

        public bool IsAvailable { get; set; }
    }
}