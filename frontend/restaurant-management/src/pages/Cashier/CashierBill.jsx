import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import cashierService from "../../services/cashierService";
import "./Cashier.css";

function CashierBill() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [paymentMode, setPaymentMode] = useState("Cash");

    useEffect(() => {
        loadBill();
    }, []);

    const loadBill = async () => {
        const data = await cashierService.getOrderBill(orderId);
        setOrder(data);
    };

    const handleConfirmPayment = async () => {
        await cashierService.processPayment(order.orderId, paymentMode);
        alert("Payment Successful");
        navigate("/cashier");
    };

    if (!order) return <p>Loading...</p>;

    const subtotal = order.items.reduce((sum, item) => sum + item.lineTotal, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    return (
        <div className="cashier-page">
            <div className="cashier-container">
                <div className="cashier-topbar">
                    <h2>Table {order.tableNumber} Bill</h2>
                </div>

                <div className="bill-card">
                    {order.items.map(item => (
                        <div className="bill-row" key={item.orderItemId}>
                            <span>{item.itemName}</span>
                            <span>x{item.quantity}</span>
                            <span>₹{item.lineTotal}</span>
                        </div>
                    ))}

                    <hr />

                    <div className="bill-row"><b>Subtotal</b><b>₹{subtotal}</b></div>
                    <div className="bill-row"><span>Tax 5%</span><span>₹{tax.toFixed(2)}</span></div>
                    <div className="bill-row total"><b>Total</b><b>₹{total.toFixed(2)}</b></div>

                    <div className="payment-mode">
                        <h3>Payment Mode</h3>
                        {["Cash", "Card", "UPI"].map(mode => (
                            <label key={mode}>
                                <input
                                    type="radio"
                                    checked={paymentMode === mode}
                                    onChange={() => setPaymentMode(mode)}
                                />
                                {mode}
                            </label>
                        ))}
                    </div>

                    <div className="bill-actions">
                        <button onClick={() => navigate("/cashier")}>← Back</button>
                        <button onClick={handleConfirmPayment}>
                            Confirm Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CashierBill;