import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import orderService from "../../services/orderService";
import "./Admin.css";

function AdminOrderDetails() {
    const navigate = useNavigate();
    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrder();

        const interval = setInterval(() => {
            loadOrder();
        }, 5000);

        return () => clearInterval(interval);

    }, [orderId]);

    const loadOrder = async () => {
        try {
            const data = await orderService.getOrderById(orderId);
            setOrder(data);
        } catch (error) {
            console.error("LOAD ORDER DETAILS ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <p>Loading order...</p>
            </AdminLayout>
        );
    }

    if (!order) {
        return (
            <AdminLayout>
                <button
                    className="back-btn"
                    onClick={() => navigate("/admin/orders")}
                >
                    ← Back
                </button>

                <p>Order not found.</p>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="admin-header">
                <div>
                    <h1>Order #{order.orderId}</h1>
                    <p>
                        Table {order.tableNumber} · {order.status}
                    </p>
                </div>

                <button
                    className="back-btn"
                    onClick={() => navigate("/admin/orders")}
                >
                    ← Back
                </button>
            </div>

            <div className="admin-detail-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Kitchen Status</th>
                            <th>Serve Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {order.items.map(item => (
                            <tr key={item.orderItemId}>
                                <td>{item.itemName}</td>
                                <td>{item.quantity}</td>

                                <td>
                                    <span
                                        className={`table-status-badge ${item.kitchenStatus.toLowerCase()}`}
                                    >
                                        {item.kitchenStatus}
                                    </span>
                                </td>

                                <td>
                                    <span
                                        className={
                                            item.isDelivered
                                                ? "availability available"
                                                : "availability unavailable"
                                        }
                                    >
                                        {item.isDelivered
                                            ? "Served"
                                            : "Not Served"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

export default AdminOrderDetails;