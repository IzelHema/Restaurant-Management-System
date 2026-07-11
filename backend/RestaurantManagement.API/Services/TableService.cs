using RestaurantManagement.API.DTOs;
using RestaurantManagement.API.Models.Entities;
using RestaurantManagement.API.Models.Enums;
using RestaurantManagement.API.Repositories;

namespace RestaurantManagement.API.Services
{
    public class TableService : ITableService
    {
        private readonly ITableRepository _tableRepository;
        private readonly IUserRepository _userRepository;
        private readonly IOrderRepository _orderRepository;

        public TableService(
            ITableRepository tableRepository,
            IUserRepository userRepository,
            IOrderRepository orderRepository)
        {
            _tableRepository = tableRepository;
            _userRepository = userRepository;
            _orderRepository = orderRepository;
        }

        public async Task<List<object>> GetAllTablesAsync()
        {
            var tables = await _tableRepository.GetAllTablesAsync();

            return tables.Select(t => new
            {
                id = t.TableId,
                tableNumber = t.TableNumber,
                capacity = t.Capacity,
                status = t.Status
            }).Cast<object>().ToList();
        }

        public async Task<object> GetTableAssignmentsAsync()
        {
            var tables = await _tableRepository.GetTableAssignmentsAsync();

            var result = new List<object>();

            foreach (var table in tables)
            {
                var activeOrderId =
                    await _orderRepository.GetActiveOrderIdByTableAsync(table.TableId);

                result.Add(new
                {
                    tableId = table.TableId,
                    tableNumber = table.TableNumber,
                    capacity = table.Capacity,
                    status = table.Status,
                    assignedWaiterId = table.AssignedWaiterId,
                    assignedWaiterName = table.AssignedWaiter != null
                        ? table.AssignedWaiter.Name
                        : null,
                    activeOrderId
                });
            }

            return result;
        }

        public async Task<bool> AssignWaiterAsync(int tableId, int? waiterId)
        {
            if (waiterId.HasValue)
            {
                var waiter = await _userRepository.GetUserByIdAsync(waiterId.Value);

                if (waiter == null)
                    return false;

                if (waiter.Role != UserRole.Waiter)
                    return false;

                if (!waiter.IsActive)
                    return false;
            }

            await _tableRepository.AssignWaiterAsync(tableId, waiterId);

            return true;
        }

        public async Task<object> GetTablesByWaiterIdAsync(int waiterId)
        {
            var tables = await _tableRepository.GetTablesByWaiterIdAsync(waiterId);

            return tables.Select(table => new
            {
                id = table.TableId,
                tableNumber = table.TableNumber,
                capacity = table.Capacity,
                status = table.Status
            });
        }

        public async Task<object> AddTableAsync(CreateTableDto request)
        {
            var table = new RestaurantTable
            {
                TableNumber = request.TableNumber,
                Capacity = request.Capacity,
                Status = request.Status,
                AssignedWaiterId = null
            };

            var created = await _tableRepository.AddTableAsync(table);

            return new
            {
                id = created.TableId,
                tableNumber = created.TableNumber,
                capacity = created.Capacity,
                status = created.Status,
                assignedWaiterId = created.AssignedWaiterId
            };
        }

        public async Task<bool> UpdateTableAsync(int id, UpdateTableDto request)
        {
            var table = await _tableRepository.GetTableByIdAsync(id);

            if (table == null)
                return false;

            table.TableNumber = request.TableNumber;
            table.Capacity = request.Capacity;
            table.Status = request.Status;

            await _tableRepository.UpdateTableAsync(table);

            return true;
        }
    }
}