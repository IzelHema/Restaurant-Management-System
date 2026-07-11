using Microsoft.EntityFrameworkCore;
using RestaurantManagement.API.Models;
using RestaurantManagement.API.Models.Entities;

namespace RestaurantManagement.API.Repositories
{
    public class TableRepository : ITableRepository
    {
        private readonly RestaurantManagementDbContext _context;

        public TableRepository(RestaurantManagementDbContext context)
        {
            _context = context;
        }

        public async Task<List<RestaurantTable>> GetAllTablesAsync()
        {
            return await _context.RestaurantTables
                .OrderBy(t => t.TableNumber)
                .ToListAsync();
        }

        public async Task<List<RestaurantTable>> GetTableAssignmentsAsync()
        {
            return await _context.RestaurantTables
                .Include(t => t.AssignedWaiter)
                .OrderBy(t => t.TableNumber)
                .ToListAsync();
        }

        public async Task AssignWaiterAsync(int tableId, int? waiterId)
        {
            var table = await _context.RestaurantTables
                .FirstOrDefaultAsync(t => t.TableId == tableId);

            if (table == null)
                return;

            table.AssignedWaiterId = waiterId;

            await _context.SaveChangesAsync();
        }

        public async Task<List<RestaurantTable>> GetTablesByWaiterIdAsync(int waiterId)
        {
            return await _context.RestaurantTables
                .Where(table => table.AssignedWaiterId == waiterId)
                .OrderBy(table => table.TableNumber)
                .ToListAsync();
        }


        public async Task<RestaurantTable> AddTableAsync(RestaurantTable table)
        {
            _context.RestaurantTables.Add(table);
            await _context.SaveChangesAsync();
            return table;
        }

        public async Task<RestaurantTable?> GetTableByIdAsync(int id)
        {
            return await _context.RestaurantTables
                .FirstOrDefaultAsync(t => t.TableId == id);
        }

        public async Task UpdateTableAsync(RestaurantTable table)
        {
            _context.RestaurantTables.Update(table);
            await _context.SaveChangesAsync();
        }

        public async Task<int> GetActiveTablesCountAsync()
        {
            return await _context.RestaurantTables.CountAsync(table =>
                table.Status != "Available"
            );
        }
    }
}