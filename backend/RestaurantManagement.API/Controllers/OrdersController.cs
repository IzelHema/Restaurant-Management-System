using Microsoft.AspNetCore.Mvc;
using RestaurantManagement.API.DTOs.Order;
using RestaurantManagement.API.Services;
using RestaurantManagement.API.DTOs;

namespace RestaurantManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder(CreateOrderRequestDto request)
        {
            if (request.Items == null || request.Items.Count == 0)
            {
                return BadRequest("Order must contain at least one item.");
            }

            var orderId = await _orderService.CreateOrderAsync(request);

            return Ok(new
            {
                success = true,
                message = "Order sent to kitchen successfully",
                orderId = orderId
            });
        }

        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingOrders()
        {
            var orders = await _orderService.GetPendingOrdersAsync();

            return Ok(orders);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(
        int id,
        UpdateOrderStatusDto request)
            {
                var updated = await _orderService.UpdateOrderStatusAsync(id, request);

                if (!updated)
                    return NotFound();

                return Ok(new
                {
                    message = "Order status updated successfully."
                });
            }

        [HttpPut("items/{orderItemId}/status")]
        public async Task<IActionResult> UpdateOrderItemStatus(
        int orderItemId,
        UpdateOrderItemStatusDto request)
            {
                var updated = await _orderService.UpdateOrderItemStatusAsync(orderItemId, request);

                if (!updated)
                    return NotFound();

                return Ok(new
                {
                    message = "Item status updated successfully."
                });
            }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetOrderById(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);

            if (order == null)
                return NotFound();

            return Ok(order);
        }

        [HttpPut("items/{orderItemId}/served")]
        public async Task<IActionResult> MarkItemServed(int orderItemId)
        {
            var updated = await _orderService.MarkOrderItemServedAsync(orderItemId);

            if (!updated)
                return NotFound();

            return Ok(new
            {
                message = "Item marked as served."
            });
        }

        [HttpPut("{orderId}/complete")]
        public async Task<IActionResult> CompleteOrder(int orderId)
        {
            var completed = await _orderService.CompleteOrderAsync(orderId);

            if (!completed)
                return NotFound();

            return Ok(new
            {
                message = "Order completed successfully."
            });
        }

        [HttpGet("completed")]
        public async Task<IActionResult> GetCompletedOrders()
        {
            var orders = await _orderService.GetCompletedOrdersAsync();

            return Ok(orders);
        }

        [HttpPost("{orderId}/payment")]
        public async Task<IActionResult> ProcessPayment(
    int orderId,
    PaymentRequestDto request)
        {
            await _orderService.ProcessPaymentAsync(orderId, request.PaymentMode);

            return Ok(new
            {
                message = "Payment Successful"
            });
        }

        [HttpGet("today")]
        public async Task<IActionResult> GetTodayOrders()
        {
            var orders = await _orderService.GetTodayOrdersAsync();
            return Ok(orders);
        }

        [HttpGet("payment-history")]
        public async Task<IActionResult> GetPaymentHistory()
        {
            var history = await _orderService.GetPaymentHistoryAsync();
            return Ok(history);
        }

        [HttpGet("admin")]
        public async Task<IActionResult> GetAllOrdersForAdmin()
        {
            var orders = await _orderService.GetAllOrdersForAdminAsync();
            return Ok(orders);
        }
    }
}