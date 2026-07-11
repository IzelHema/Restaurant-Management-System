import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cashierService from "../../services/cashierService";
import "./Cashier.css";

function CashierHistory() {

    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [dateFilter, setDateFilter] = useState("All");

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        const data = await cashierService.getPaymentHistory();
        setHistory(data);
    };

    const filteredHistory = history.filter((bill) => {

        const paymentDate = new Date(bill.paymentDate);
        const today = new Date();

        if (dateFilter === "Today") {
            return paymentDate.toDateString() === today.toDateString();
        }

        if (dateFilter === "Week") {
            const weekAgo = new Date();
            weekAgo.setDate(today.getDate() - 7);

            return paymentDate >= weekAgo;
        }

        if (dateFilter === "Month") {
            return (
                paymentDate.getMonth() === today.getMonth() &&
                paymentDate.getFullYear() === today.getFullYear()
            );
        }

        return true;
    });

    return (
        <div className="cashier-page">
            <div className="cashier-container">

                <div className="cashier-topbar">
                    <h2>Payment History</h2>
                    <button
                        className="back-btn"
                        onClick={() => navigate("/cashier")}
                    >
                        ← Back
                    </button>
                </div>

                <div className="history-toolbar">

                    <select
                        className="history-filter"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    >
                        <option value="All">All Payments</option>
                        <option value="Today">Today</option>
                        <option value="Week">This Week</option>
                        <option value="Month">This Month</option>
                    </select>

                </div>                


                <div className="cashier-order-grid">

                    {filteredHistory.map((bill) => (

                        <div
                            key={bill.billId}
                            className="cashier-order-btn"
                            
                        >
                            <h3>Table {bill.tableNumber}</h3>

                            <p>Order #{bill.orderId}</p>

                            <p><b>₹{bill.grandTotal}</b></p>

                            <small>{bill.paymentMode}</small>
                        </div>

                    ))}

                </div>

            </div>
        </div>
    );
}

export default CashierHistory;