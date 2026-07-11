using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RestaurantManagement.API.Models.Entities
{
    public class Bill
    {
        // Primary Key
        [Key]
        public int BillId { get; set; }

        // Foreign Key
        [ForeignKey("Order")]
        public int OrderId { get; set; }

        // Bill Details
        public decimal SubTotal { get; set; }

        public decimal Tax { get; set; }

        public decimal Discount { get; set; }

        public decimal GrandTotal { get; set; }

        public DateTime BillDate { get; set; } = DateTime.Now;

        // Navigation Property
        public Order? Order { get; set; }

        public Payment? Payment { get; set; }
    }
}