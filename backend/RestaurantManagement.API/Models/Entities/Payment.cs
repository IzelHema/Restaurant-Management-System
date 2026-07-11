using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RestaurantManagement.API.Models.Enums;

namespace RestaurantManagement.API.Models.Entities
{
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }

        [ForeignKey("Bill")]
        public int BillId { get; set; }

        public decimal AmountPaid { get; set; }

        public PaymentMode PaymentMode { get; set; }

        public DateTime PaymentDate { get; set; } = DateTime.Now;

        public Bill? Bill { get; set; }
    }
}