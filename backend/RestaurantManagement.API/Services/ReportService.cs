using RestaurantManagement.API.Repositories;

namespace RestaurantManagement.API.Services
{
    public class ReportService : IReportService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IBillRepository _billRepository;
        private readonly ITableRepository _tableRepository;

        public ReportService(
            IOrderRepository orderRepository,
            IBillRepository billRepository,
            ITableRepository tableRepository)
        {
            _orderRepository = orderRepository;
            _billRepository = billRepository;
            _tableRepository = tableRepository;
        }

        public async Task<object> GetSummaryAsync()
        {
            var todayOrders = await _orderRepository.GetTodayOrdersCountAsync();
            var pendingOrders = await _orderRepository.GetPendingOrdersCountAsync();
            var todayRevenue = await _billRepository.GetTodayRevenueAsync();
            var activeTables = await _tableRepository.GetActiveTablesCountAsync();

            return new
            {
                todayOrders,
                pendingOrders,
                todayRevenue,
                activeTables
            };
        }
    }
}