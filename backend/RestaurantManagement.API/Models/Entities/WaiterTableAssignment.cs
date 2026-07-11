using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RestaurantManagement.API.Models.Entities
{
    public class WaiterTableAssignment
    {
        [Key]
        public int AssignmentId { get; set; }

        [ForeignKey("User")]
        public int WaiterId { get; set; }

        [ForeignKey("RestaurantTable")]
        public int TableId { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation Properties
        public User? User { get; set; }

        public RestaurantTable? RestaurantTable { get; set; }
    }
}