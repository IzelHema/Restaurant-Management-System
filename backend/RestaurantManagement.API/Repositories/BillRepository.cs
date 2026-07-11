using Microsoft.EntityFrameworkCore;
using RestaurantManagement.API.Models;

namespace RestaurantManagement.API.Repositories
{
    public class BillRepository : IBillRepository
    {
        private readonly RestaurantManagementDbContext _context;

        public BillRepository(RestaurantManagementDbContext context)
        {
            _context = context;
        }

        public async Task<decimal> GetTodayRevenueAsync()
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            return await _context.Bills
                .Where(bill =>
                    bill.BillDate >= today &&
                    bill.BillDate < tomorrow &&
                    bill.Payment != null
                )
                .SumAsync(bill => (decimal?)bill.GrandTotal) ?? 0;
        }
    }
}