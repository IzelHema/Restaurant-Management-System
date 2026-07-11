import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { HiClipboardDocumentList } from "react-icons/hi2";
import orderService from "../../services/orderService";
import "../OrderStatus/OrderStatus.css";

function OrdersHistoryDetails() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        loadOrder();
    }, []);

    const loadOrder = async () => {
        const data = await orderService.getOrderById(orderId);
        setOrder(data);
    };

    if (!order) return <p>Loading...</p>;

    return (
        <div className="status-page">
            <div className="status-container">

                <div className="waiter-topbar">
                    <div className="orders-card">
                        Orders Today 
                    </div>

                    <div className="top-icons">
                        <FaHome className="icon" onClick={() => navigate("/waiter")} />
                        <HiClipboardDocumentList className="icon" onClick={() => navigate("/order-status")} />
                    </div>
                </div>

                <div className="status-header">
                    <div>
                        <h2>Order #{order.orderId}</h2>
                        <p>Table {order.tableNumber}</p>
                    </div>

                    <button
                        className="status-back-btn"
                        onClick={() => navigate("/orders")}
                    >
                        ← Back
                    </button>
                </div>

                <div className="status-list">
                    {order.items.map((item) => (
                        <div className="status-order-card" key={item.orderItemId}>
                            <h3>{item.itemName}</h3>
                            <div className="status-item-count">
                                x{item.quantity}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default OrdersHistoryDetails;