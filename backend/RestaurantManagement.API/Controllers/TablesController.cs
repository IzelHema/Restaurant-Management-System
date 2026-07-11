using Microsoft.AspNetCore.Mvc;
using RestaurantManagement.API.Services;
using RestaurantManagement.API.DTOs;

namespace RestaurantManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TablesController : ControllerBase
    {
        private readonly ITableService _tableService;

        public TablesController(ITableService tableService)
        {
            _tableService = tableService;
        }

        [HttpGet]
        public async Task<IActionResult> GetTables()
        {
            return Ok(await _tableService.GetAllTablesAsync());
        }

        [HttpGet("assignments")]
        public async Task<IActionResult> GetTableAssignments()
        {
            var tables = await _tableService.GetTableAssignmentsAsync();
            return Ok(tables);
        }

        [HttpPut("{tableId}/assign")]
        public async Task<IActionResult> AssignWaiter(
            int tableId,
            AssignTableDto request)
        {
            var assigned = await _tableService.AssignWaiterAsync(
                tableId,
                request.WaiterId
            );

            if (!assigned)
            {
                return BadRequest(new
                {
                    message = "Invalid table or waiter. Only active waiters can be assigned."
                });
            }

            return Ok(new
            {
                message = request.WaiterId.HasValue
                    ? "Waiter assigned successfully."
                    : "Table unassigned successfully."
            });
        }

        [HttpGet("waiter/{waiterId}")]
        public async Task<IActionResult> GetTablesByWaiterId(int waiterId)
        {
            var tables = await _tableService.GetTablesByWaiterIdAsync(waiterId);
            return Ok(tables);
        }


        [HttpPost]
        public async Task<IActionResult> AddTable(CreateTableDto request)
        {
            var table = await _tableService.AddTableAsync(request);
            return Ok(table);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTable(
            int id,
            UpdateTableDto request)
        {
            var updated = await _tableService.UpdateTableAsync(id, request);

            if (!updated)
            {
                return NotFound(new
                {
                    message = "Table not found."
                });
            }

            return Ok(new
            {
                message = "Table updated successfully."
            });
        }
    }
}