using RestaurantManagement.API.Models;
using RestaurantManagement.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using RestaurantManagement.API.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace RestaurantManagement.API.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly RestaurantManagementDbContext _context;

        public OrderRepository(RestaurantManagementDbContext context)
        {
            _context = context;
        }

        public async Task<Order> CreateOrderAsync(Order order)
        {

            _context.Orders.Add(order);

            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<List<Order>> GetPendingOrdersAsync()
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.RestaurantTable)
                .Where(o => o.OrderStatus == OrderStatus.InProgress)
                .OrderBy(o => o.OrderDate)
                .ToListAsync();
        }

        public async Task<Order?> GetOrderByIdAsync(int orderId)
        {
            return await _context.Orders.FindAsync(orderId);
        }

        public async Task UpdateOrderAsync(Order order)
        {
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateTableStatusAsync(int tableId, string status)
        {
            var table = await _context.RestaurantTables.FindAsync(tableId);

            if (table != null)
            {
                table.Status = status;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<OrderItem?> GetOrderItemByIdAsync(int orderItemId)
        {
            return await _context.OrderItems.FindAsync(orderItemId);
        }

        public async Task UpdateOrderItemAsync(OrderItem orderItem)
        {
            _context.OrderItems.Update(orderItem);
            await _context.SaveChangesAsync();
        }
        
        public async Task<Order?> GetOrderWithItemsAsync(int orderId)
        {
            return await _context.Orders
                .Include(o => o.RestaurantTable)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItem)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);
        }

        public async Task<Order?> GetActiveOrderByTableIdAsync(int tableId)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o =>
                    o.TableId == tableId &&
                    o.OrderStatus == OrderStatus.InProgress
                );
        }

        public async Task<List<Order>> GetCompletedOrdersAsync()
        {
            return await _context.Orders
                .Include(o => o.RestaurantTable)
                .Include(o => o.OrderItems)
                .Where(o => o.OrderStatus == OrderStatus.Completed)
                .ToListAsync();
        }

        public async Task ProcessPaymentAsync(int orderId, string paymentMode)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(i => i.MenuItem)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (order == null)
                return;

            decimal subtotal = order.OrderItems.Sum(i => i.Quantity * i.MenuItem.Price);
            decimal tax = subtotal * 0.05m;
            decimal total = subtotal + tax;

            var existingBill = await _context.Bills
    .FirstOrDefaultAsync(b => b.OrderId == orderId);

            if (existingBill != null)
            {
                order.OrderStatus = OrderStatus.Paid;

                var existingTable = await _context.RestaurantTables.FindAsync(order.TableId);

                if (existingTable != null)
                    existingTable.Status = "Available";

                await _context.SaveChangesAsync();

                return;
            }

            var bill = new Bill
            {
                OrderId = orderId,
                SubTotal = subtotal,
                Tax = tax,
                Discount = 0,
                GrandTotal = total,
                BillDate = DateTime.Now
            };

            _context.Bills.Add(bill);
            await _context.SaveChangesAsync();

            var payment = new Payment
            {
                BillId = bill.BillId,
                PaymentMode = Enum.Parse<PaymentMode>(paymentMode, true),
                AmountPaid = total,
                PaymentDate = DateTime.Now
            };

            _context.Payments.Add(payment);

            order.OrderStatus = OrderStatus.Paid;

            var table = await _context.RestaurantTables.FindAsync(order.TableId);

            if (table != null)
                table.Status = "Available";

            await _context.SaveChangesAsync();
        }

        public async Task<List<Order>> GetTodayOrdersAsync()
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            return await _context.Orders
                .Include(o => o.RestaurantTable)
                .Include(o => o.OrderItems)
                .Where(o => o.OrderDate >= today && o.OrderDate < tomorrow)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        public async Task<List<Bill>> GetPaymentHistoryAsync()
        {
            return await _context.Bills
                .Include(b => b.Order)
                    .ThenInclude(o => o.RestaurantTable)
                .Include(b => b.Payment)
                .OrderByDescending(b => b.BillDate)
                .ToListAsync();
        }

        public async Task<List<Order>> GetAllOrdersForAdminAsync()
        {
            return await _context.Orders
                .Include(o => o.RestaurantTable)
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        public async Task<int> GetTodayOrdersCountAsync()
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            return await _context.Orders.CountAsync(order =>
                order.OrderDate >= today &&
                order.OrderDate < tomorrow
            );
        }

        public async Task<int> GetPendingOrdersCountAsync()
        {
            return await _context.Orders.CountAsync(order =>
                order.OrderStatus != OrderStatus.Paid
            );
        }

        public async Task<int?> GetActiveOrderIdByTableAsync(int tableId)
        {
            var order = await _context.Orders
                .Where(o =>
                    o.TableId == tableId &&
                    o.OrderStatus != OrderStatus.Paid
                )
                .OrderByDescending(o => o.OrderDate)
                .FirstOrDefaultAsync();

            return order?.OrderId;
        }

    }
}