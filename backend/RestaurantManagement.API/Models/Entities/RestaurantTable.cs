using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RestaurantManagement.API.Models.Entities
{
    public class RestaurantTable
    {
        [Key]
        public int TableId { get; set; }

        [Required]
        public int TableNumber { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Available";

        public int Capacity { get; set; }


        public int? AssignedWaiterId { get; set; }

        [ForeignKey(nameof(AssignedWaiterId))]
        public User? AssignedWaiter { get; set; }

    }
}