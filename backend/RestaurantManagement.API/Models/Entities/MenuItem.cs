using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RestaurantManagement.API.Models.Entities
{
    public class MenuItem
    {
        [Key]
        public int MenuItemId { get; set; }

        [Required]
        [StringLength(100)]
        public string ItemName { get; set; } = string.Empty;

        [Required]
        public decimal Price { get; set; }

        [ForeignKey("MenuCategory")]
        public int CategoryId { get; set; }

        public bool IsAvailable { get; set; } = true;

        // Navigation Property
        public MenuCategory? MenuCategory { get; set; }
    }
}