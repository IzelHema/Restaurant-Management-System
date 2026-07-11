using RestaurantManagement.API.DTOs.Order;
using RestaurantManagement.API.Models.Entities;
using RestaurantManagement.API.Models.Enums;
using RestaurantManagement.API.Repositories;

namespace RestaurantManagement.API.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;

        public OrderService(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<int> CreateOrderAsync(CreateOrderRequestDto request)
        {
            var existingOrder = await _orderRepository.GetActiveOrderByTableIdAsync(request.TableId);

            if (existingOrder != null)
            {
                foreach (var item in request.Items)
                {
                    existingOrder.OrderItems.Add(new OrderItem
                    {
                        MenuItemId = item.ItemId,
                        Quantity = item.Quantity,
                        UnitPrice = 0,
                        KitchenStatus = KitchenStatus.Pending,
                        IsDelivered = false
                    });
                }

                await _orderRepository.UpdateOrderAsync(existingOrder);

                return existingOrder.OrderId;
            }

            var order = new Order
            {
                TableId = request.TableId,
                WaiterId = request.WaiterId,
                CustomerCount = 1,
                OrderStatus = OrderStatus.InProgress,
                OrderItems = request.Items.Select(item => new OrderItem
                {
                    MenuItemId = item.ItemId,
                    Quantity = item.Quantity,
                    UnitPrice = 0,
                    KitchenStatus = KitchenStatus.Pending,
                    IsDelivered = false
                }).ToList()
            };

            var createdOrder = await _orderRepository.CreateOrderAsync(order);

            await _orderRepository.UpdateTableStatusAsync(request.TableId, "Ordering");

            return createdOrder.OrderId;
        }

        public async Task<List<object>> GetPendingOrdersAsync()
        {
            var orders = await _orderRepository.GetPendingOrdersAsync();

            return orders.Select(order => new
            {
                orderId = order.OrderId,
                tableId = order.TableId,
                tableNumber = order.RestaurantTable.TableNumber,
                orderDate = order.OrderDate,
                status = order.OrderStatus.ToString(),
                items = order.OrderItems.Select(item => new
                {
                    orderItemId = item.OrderItemId,
                    itemName = item.MenuItem.ItemName,
                    quantity = item.Quantity,
                    kitchenStatus = item.KitchenStatus.ToString(),
                    isDelivered = item.IsDelivered
                }).ToList()
            }).Cast<object>().ToList();
        }

        public async Task<bool> UpdateOrderStatusAsync(
        int orderId,
        UpdateOrderStatusDto request)
            {
                var order = await _orderRepository.GetOrderByIdAsync(orderId);

                if (order == null)
                    return false;

                order.OrderStatus = request.OrderStatus;

                await _orderRepository.UpdateOrderAsync(order);

                return true;
            }

        public async Task<bool> UpdateOrderItemStatusAsync(
        int orderItemId,
        UpdateOrderItemStatusDto request)
            {
                var orderItem = await _orderRepository.GetOrderItemByIdAsync(orderItemId);

                if (orderItem == null)
                    return false;

                orderItem.KitchenStatus = request.KitchenStatus;

                await _orderRepository.UpdateOrderItemAsync(orderItem);

                return true;
            }

        public async Task<object?> GetOrderByIdAsync(int orderId)
        {
            var order = await _orderRepository.GetOrderWithItemsAsync(orderId);

            if (order == null)
                return null;

            return new
            {
                orderId = order.OrderId,
                tableId = order.TableId,
                tableNumber = order.RestaurantTable.TableNumber,
                status = order.OrderStatus.ToString(),
                items = order.OrderItems.Select(item => new
                {
                    orderItemId = item.OrderItemId,
                    itemName = item.MenuItem.ItemName,
                    quantity = item.Quantity,
                    price = item.MenuItem.Price,
                    lineTotal = item.Quantity * item.MenuItem.Price,
                    kitchenStatus = item.KitchenStatus.ToString(),
                    isDelivered = item.IsDelivered
                }).ToList()
            };
        }

        public async Task<bool> MarkOrderItemServedAsync(int orderItemId)
        {
            var orderItem = await _orderRepository.GetOrderItemByIdAsync(orderItemId);

            if (orderItem == null)
                return false;

            orderItem.IsDelivered = true;

            await _orderRepository.UpdateOrderItemAsync(orderItem);

            return true;
        }

        public async Task<bool> CompleteOrderAsync(int orderId)
        {
            var order = await _orderRepository.GetOrderByIdAsync(orderId);

            if (order == null)
                return false;

            order.OrderStatus = OrderStatus.Completed;

            await _orderRepository.UpdateOrderAsync(order);

            return true;
        }

        public async Task<object> GetCompletedOrdersAsync()
        {
            var orders = await _orderRepository.GetCompletedOrdersAsync();

            return orders.Select(order => new
            {
                orderId = order.OrderId,
                tableNumber = order.RestaurantTable.TableNumber,
                itemCount = order.OrderItems.Count
            });
        }

        public async Task ProcessPaymentAsync(int orderId, string paymentMode)
        {
            await _orderRepository.ProcessPaymentAsync(orderId, paymentMode);
        }

        public async Task<object> GetTodayOrdersAsync()
        {
            var orders = await _orderRepository.GetTodayOrdersAsync();

            return orders.Select(order => new
            {
                orderId = order.OrderId,
                tableNumber = order.RestaurantTable.TableNumber,
                status = order.OrderStatus.ToString(),
                itemCount = order.OrderItems.Count,
                orderDate = order.OrderDate
            });
        }

        public async Task<object> GetPaymentHistoryAsync()
        {
            var bills = await _orderRepository.GetPaymentHistoryAsync();

            return bills.Select(bill => new
            {
                billId = bill.BillId,
                orderId = bill.OrderId,
                tableNumber = bill.Order!.RestaurantTable.TableNumber,
                subTotal = bill.SubTotal,
                tax = bill.Tax,
                discount = bill.Discount,
                grandTotal = bill.GrandTotal,
                billDate = bill.BillDate,
                paymentMode = bill.Payment!.PaymentMode.ToString(),
                amountPaid = bill.Payment.AmountPaid,
                paymentDate = bill.Payment.PaymentDate
            });
        }

        public async Task<object> GetAllOrdersForAdminAsync()
        {
            var orders = await _orderRepository.GetAllOrdersForAdminAsync();

            return orders.Select(order => new
            {
                orderId = order.OrderId,
                tableId = order.TableId,
                tableNumber = order.RestaurantTable?.TableNumber,
                waiterId = order.WaiterId,
                waiterName = order.User?.Name,
                orderDate = order.OrderDate,
                status = order.OrderStatus.ToString(),
                itemCount = order.OrderItems.Sum(item => item.Quantity)
            });
        }
    }
}