import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import orderService from "../../services/orderService";
import "./KitchenTV.css";

function Kitchen() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        loadOrders();

        const interval = setInterval(loadOrders, 3000);

        return () => clearInterval(interval);
    }, []);

    const loadOrders = async () => {
        const data = await orderService.getPendingOrders();
        setOrders(data);
    };

    return (
        <div className="kitchen-page">
            <div className="kitchen-tv-header">
                <div>
                    <button
                        className="kitchen-back-btn"
                        onClick={() => navigate("/kitchen")}
                    >
                        ← Back
                    </button>

                    <h1>Kitchen Display</h1>
                </div>

                <div className="kitchen-live-indicator">
                    <span className="kitchen-live-dot"></span>
                    Auto Refresh • 3 sec
                </div>
            </div>

            <div className="kitchen-grid">
                {orders.map((order) => (
                    <div className="kitchen-card" key={order.orderId}>
                        <h2>Table {order.tableNumber}</h2>
                        <p>Status: {order.status}</p>

                        {order.items.map((item) => (
                            <div className="kitchen-item" key={item.orderItemId}>
                                <span>{item.itemName}</span>
                                <span>x{item.quantity}</span>
                                <span>{item.kitchenStatus}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Kitchen;