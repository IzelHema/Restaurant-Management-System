using System.ComponentModel.DataAnnotations;

namespace RestaurantManagement.API.Models.Entities
{
    public class MenuCategory
    {
        [Key]
        public int CategoryId { get; set; }

        [Required]
        [StringLength(100)]
        public string CategoryName { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        // Navigation Property
        public ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
    }
}