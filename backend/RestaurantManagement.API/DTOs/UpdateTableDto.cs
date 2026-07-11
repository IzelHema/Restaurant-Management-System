namespace RestaurantManagement.API.DTOs
{
    public class UpdateTableDto
    {
        public int TableNumber { get; set; }

        public int Capacity { get; set; }

        public string Status { get; set; } = "Available";
    }
}