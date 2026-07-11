using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RestaurantManagement.API.Models.Enums;

namespace RestaurantManagement.API.Models.Entities
{
    public class Order
    {
        // Primary Key
        [Key]
        public int OrderId { get; set; }

        // Foreign Keys
        [ForeignKey("RestaurantTable")]
        public int TableId { get; set; }

        [ForeignKey("User")]
        public int WaiterId { get; set; }

        // Order Details
        public DateTime OrderDate { get; set; } = DateTime.Now;

        public int CustomerCount { get; set; }

        public OrderStatus OrderStatus { get; set; } = OrderStatus.InProgress;

        // Navigation Properties
        public RestaurantTable? RestaurantTable { get; set; }

        public User? User { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}