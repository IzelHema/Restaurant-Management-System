import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import orderService from "../../services/orderService";
import "./OrderStatus.css";
import { FaHome } from "react-icons/fa";
import { HiClipboardDocumentList } from "react-icons/hi2";

function OrderStatus() {

    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        loadOrders();
        const interval = setInterval(loadOrders, 3000);

        return () => clearInterval(interval);

    }, []);

    const loadOrders = async () => {

        const data = await orderService.getActiveOrders();

        setOrders(data);

    };

    return (
        <div className="status-page">
            <div className="status-container">

                <div className="waiter-topbar">

                    <div
                        className="orders-card"
                        onClick={() => navigate("/orders")}
                    >
                        Orders Today
                        <span>14</span>
                    </div>

                    <div className="top-icons">

                        <FaHome
                            className="icon"
                            onClick={() => navigate("/waiter")}
                        />

                        <HiClipboardDocumentList
                            className="icon"
                            onClick={() => navigate("/order-status")}
                        />

                    </div>

                </div>

                <div className="status-header">

                    <h2>Active Orders</h2>

                    <button
                        className="status-back-btn"
                        onClick={() => navigate("/waiter")}
                    >
                        ← Back
                    </button>

                </div>

                <div className="status-list">

                    {orders.map(order => (

                        <div
                            key={order.orderId}
                            className="status-order-card"
                            onClick={() =>
                                navigate(`/order-status/${order.orderId}`)
                            }
                        >

                            <div>

                                <h3>Table {order.tableNumber}</h3>

                                <p>{order.status}</p>

                            </div>

                            <div className="status-item-count">

                                {order.items.length} Items →

                            </div>

                        </div>

                    ))}

                </div>

            </div>
        </div>
    );

}

export default OrderStatus;