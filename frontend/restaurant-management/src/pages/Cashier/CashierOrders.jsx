import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cashierService from "../../services/cashierService";
import "./Cashier.css";

function CashierOrders() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadOrders();

        const interval = setInterval(loadOrders, 5000);

        return () => clearInterval(interval);
    }, []);

    const loadOrders = async () => {
        const data = await cashierService.getCompletedOrders();
        setOrders(data);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="cashier-page">
            <div className="cashier-container">
                <div className="cashier-topbar">
                    <h2>ORDERS</h2>
                    <div className="cashier-top-buttons">
                        <button onClick={() => navigate("/cashier/history")}>
                            Payment History
                        </button>

                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>

                

                <div className="cashier-order-grid">
                    {orders.map((order) => (
                        <button
                            key={order.orderId}
                            className="cashier-order-btn"
                            onClick={() => navigate(`/cashier/orders/${order.orderId}`)}
                        >
                            Table {order.tableNumber} Orders →
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CashierOrders;