import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import orderService from "../../services/orderService";
import "./KitchenDevice.css";

function KitchenDevice() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        loadOrders();

        const interval = setInterval(loadOrders, 5000);

        return () => clearInterval(interval);
    }, []);

    const loadOrders = async () => {
        const data = await orderService.getPendingOrders();
        setOrders(data);
    };

    const updateItemStatus = async (orderItemId, statusValue) => {
        await orderService.updateOrderItemStatus(orderItemId, statusValue);
        loadOrders();
    };

    return (
        <div className="kitchen-device-page">
            <div className="kitchen-device-header">

                <div>
                    <button
                        className="kitchen-back-btn"
                        onClick={() => navigate("/kitchen")}
                    >
                        ← Back
                    </button>

                    <h1>Kitchen Device</h1>

                </div>

                <div className="kitchen-live-indicator">
                    <span className="kitchen-live-dot"></span>
                    Auto Refresh • 3 sec
                </div>

            </div>

            <div className="kitchen-device-grid">
                {orders.map((order) => (
                    <div className="kitchen-device-card" key={order.orderId}>
                        <h2>Table {order.tableNumber}</h2>
                        <p>Order Status: {order.status}</p>

                        {order.items.map((item) => (
                            <div className="kitchen-device-item" key={item.orderItemId}>
                                <div>
                                    <h3>{item.itemName}</h3>
                                    <p>Qty: {item.quantity}</p>
                                    <p>Status: {item.kitchenStatus}</p>
                                </div>

                                <div className="kitchen-status-buttons">
                                    <button onClick={() => updateItemStatus(item.orderItemId, 0)}>
                                        Pending
                                    </button>

                                    <button onClick={() => updateItemStatus(item.orderItemId, 1)}>
                                        Preparing
                                    </button>

                                    <button onClick={() => updateItemStatus(item.orderItemId, 2)}>
                                        Ready
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default KitchenDevice;