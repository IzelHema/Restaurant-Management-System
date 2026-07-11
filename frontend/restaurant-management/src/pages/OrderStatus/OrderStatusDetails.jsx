import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { HiClipboardDocumentList } from "react-icons/hi2";
import orderService from "../../services/orderService";
import "./OrderStatus.css";

function OrderStatusDetails() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        loadOrder();

        const interval = setInterval(() => {loadOrder();}, 5000); 

        return () => clearInterval(interval);
    }, []);

    const loadOrder = async () => {
        const data = await orderService.getOrderById(orderId);
        setOrder(data);
    };

    const markServed = async (orderItemId) => {
        await orderService.markItemServed(orderItemId);
        loadOrder();
    };

    const handleDone = async () => {
        await orderService.completeOrder(order.orderId);
        navigate("/order-status");
    };

    if (!order) return <p>Loading...</p>;

    const allReady = order.items.every(item => item.kitchenStatus === "Ready");

    return (
        <div className="status-page">
            <div className="status-container">

                <div className="waiter-topbar">
                    <div className="orders-card" onClick={() => navigate("/orders")}>
                        Orders Today 
                    </div>

                    <div className="top-icons">
                        <FaHome className="icon" onClick={() => navigate("/waiter")} />
                        <HiClipboardDocumentList className="icon" onClick={() => navigate("/order-status")} />
                    </div>
                </div>

                <div className="status-header">
                    <h2>Table {order.tableNumber}</h2>

                    <button
                        className="status-back-btn"
                        onClick={() => navigate("/order-status")}
                    >
                        ← Back
                    </button>
                </div>

                <div className="status-list">
                    {order.items.map(item => (
                        <div className="status-order-card" key={item.orderItemId}>
                            <div>
                                <h3>{item.itemName}</h3>
                                <p>Qty: {item.quantity}</p>
                            </div>

                            <span className={`status-badge ${item.kitchenStatus.toLowerCase()}`}>
                                {item.kitchenStatus === "Ready" && !item.isDelivered && (
                                    <button
                                        className="serve-btn"
                                        onClick={() => markServed(item.orderItemId)}
                                    >
                                        Serve
                                    </button>
                                )}

                                {item.isDelivered && (
                                    <span className="served-text">Served ✓</span>
                                )}
                            </span>
                        </div>
                    ))}
                </div>

                <button
                    className={allReady ? "done-btn active" : "done-btn"}
                    disabled={!allReady}
                    onClick={handleDone}
                >
                    Done
                </button>

            </div>
        </div>
    );
}

export default OrderStatusDetails;