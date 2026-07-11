import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { HiClipboardDocumentList } from "react-icons/hi2";
import orderService from "../../services/orderService";
import "../OrderStatus/OrderStatus.css";

function OrdersHistory() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        const data = await orderService.getTodayOrders();
        setOrders(data);
    };

    return (
        <div className="status-page">
            <div className="status-container">

                <div className="waiter-topbar">
                    <div className="orders-card">
                        Orders Today <span>{orders.length}</span>
                    </div>

                    <div className="top-icons">
                        <FaHome className="icon" onClick={() => navigate("/waiter")} />
                        <HiClipboardDocumentList className="icon" onClick={() => navigate("/order-status")} />
                    </div>
                </div>

                <div className="status-header">
                    <h2>Today's Orders</h2>

                    <button
                        className="status-back-btn"
                        onClick={() => navigate("/waiter")}
                    >
                        ← Back
                    </button>
                </div>

                <div className="status-list">
                    {orders.map((order) => (
                        <div
                            key={order.orderId}
                            className="status-order-card clickable"
                            onClick={() => navigate(`/orders/${order.orderId}`)}
                        >
                            <div>
                                <h3>Table {order.tableNumber}</h3>
                                <p>Order #{order.orderId}</p>
                                <p>{order.itemCount} Items</p>
                            </div>

                            <div className="status-item-count">
                                <b>{order.status}</b>
                                <br />
                                <small>
                                    {new Date(order.orderDate).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </small>
                                <br />
                                →
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default OrdersHistory;