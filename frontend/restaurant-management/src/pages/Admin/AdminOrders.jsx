import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import orderService from "../../services/orderService";
import "./Admin.css";
import "./Management.css";

function AdminOrders() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState("All");

    useEffect(() => {
        loadOrders();

        const interval = setInterval(loadOrders, 3000);

        return () => clearInterval(interval);
    }, []);

    const loadOrders = async () => {
        try {
            const data = await orderService.getAdminOrders();
            setOrders(data);
        }
        catch (error) {
            console.error(error);
        }
    };

    const filteredOrders = orders.filter((order) => {
        const query = search.toLowerCase();

        const matchesSearch =
            order.orderId.toString().includes(query) ||
            order.tableNumber?.toString().includes(query) ||
            (order.waiterName ?? "").toLowerCase().includes(query);

        const matchesStatus =
            statusFilter === "All" ||
            order.status === statusFilter;

        const orderDate = new Date(order.orderDate);
        const now = new Date();

        let matchesDate = true;

        if (dateFilter === "Today") {
            matchesDate =
                orderDate.toDateString() === now.toDateString();
        }

        if (dateFilter === "Week") {
            const sevenDaysAgo = new Date(now);
            sevenDaysAgo.setDate(now.getDate() - 7);
            sevenDaysAgo.setHours(0, 0, 0, 0);

            matchesDate = orderDate >= sevenDaysAgo;
        }

        if (dateFilter === "Month") {
            matchesDate =
                orderDate.getMonth() === now.getMonth() &&
                orderDate.getFullYear() === now.getFullYear();
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    return (
        <AdminLayout>

            <div className="management-header">
                <h1>Orders</h1>
            </div>

            <div className="management-toolbar">
                <input
                    className="management-search"
                    placeholder="Search Order ID, Table or Waiter"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="management-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Paid">Paid</option>
                </select>

                <select
                    className="management-filter"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                >
                    <option value="All">All Dates</option>
                    <option value="Today">Today</option>
                    <option value="Week">Last 7 Days</option>
                    <option value="Month">This Month</option>
                </select>
            </div>

            <div className="management-table-card">

                <table className="admin-table">

                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Table</th>
                            <th>Waiter</th>
                            <th>Items</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {filteredOrders.map(order => (

                            <tr key={order.orderId}>
                                <td>
                                    <span className="id-badge">
                                        #{order.orderId}
                                    </span>
                                </td>

                                <td>
                                    <strong>Table {order.tableNumber}</strong>
                                </td>

                                <td>{order.waiterName || "Unassigned"}</td>

                                <td>
                                    <span className="capacity-pill">
                                        {order.itemCount} Items
                                    </span>
                                </td>

                                <td>
                                    <span
                                        className={`status-pill ${
                                            order.status === "Paid"
                                                ? "success"
                                                : order.status === "Completed"
                                                ? "warning"
                                                : "info"
                                        }`}
                                    >
                                        {order.status === "InProgress"
                                            ? "In Progress"
                                            : order.status}
                                    </span>
                                </td>

                                <td>
                                    {new Date(order.orderDate).toLocaleDateString("en-GB")}
                                </td>

                                <td>
                                    {new Date(order.orderDate).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false
                                    })}
                                </td>

                                <td>
                                    <button
                                        className="action-btn edit-action"
                                        onClick={() =>
                                            navigate(`/admin/orders/${order.orderId}`)
                                        }
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>

                        ))}

                    </tbody>

                </table>
            </div>

        </AdminLayout>
    );
}

export default AdminOrders;