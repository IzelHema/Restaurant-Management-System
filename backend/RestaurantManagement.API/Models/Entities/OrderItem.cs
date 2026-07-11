using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RestaurantManagement.API.Models.Enums;

namespace RestaurantManagement.API.Models.Entities
{
    public class OrderItem
    {
        // Primary Key
        [Key]
        public int OrderItemId { get; set; }

        // Foreign Keys
        [ForeignKey("Order")]
        public int OrderId { get; set; }

        [ForeignKey("MenuItem")]
        public int MenuItemId { get; set; }

        // Item Details
        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        [StringLength(250)]
        public string? SpecialInstruction { get; set; }

        public KitchenStatus KitchenStatus { get; set; } = KitchenStatus.Pending;

        public bool IsDelivered { get; set; } = false;

        // Navigation Properties
        public Order? Order { get; set; }

        public MenuItem? MenuItem { get; set; }

        public DateTime SentToKitchenAt { get; set; }
    }
}