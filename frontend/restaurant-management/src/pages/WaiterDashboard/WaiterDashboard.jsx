import { useNavigate } from "react-router-dom";
import { getUser } from "../../utils/localStorage";

import { useEffect, useState } from "react";
import tableService from "../../services/tableService";

import orderService from "../../services/orderService";

import { FaHome } from "react-icons/fa";
import { HiClipboardDocumentList } from "react-icons/hi2";

import "./WaiterDashboard.css";

function WaiterDashboard() {
    const navigate = useNavigate();
    const user = getUser();
    const [todayOrdersCount, setTodayOrdersCount] = useState(0);

    const [tables, setTables] = useState([]);

    const handleTableClick = (table) => {
        console.log("CLICKED TABLE:", table);
        console.log("TABLE ID:", table.id);

        navigate(`/cart/${table.id}`);
    };

    const loadTodayOrdersCount = async () => {
        try {
            const data = await orderService.getTodayOrders();
            setTodayOrdersCount(data.length);
        } catch (error) {
            console.error("TODAY ORDERS COUNT ERROR:", error);
        }
    };

    useEffect(() => {
        if (!user?.userId) return;

        loadTables();
        loadTodayOrdersCount();

        const interval = setInterval(() => {
            loadTables();
            loadTodayOrdersCount();
        }, 5000);

        return () => clearInterval(interval);
    }, [user?.userId]);

    const loadTables = async () => {
        try {
            if (!user?.userId) {
                console.error("Logged-in waiter ID not found");
                return;
            }

            const data = await tableService.getTablesByWaiter(user.userId);
            setTables(data);
        }
        catch (error) {
            console.error("LOAD ASSIGNED TABLES ERROR:", error);
        }
    };

    

    return (
        <div className="waiter-page">
            <div className="waiter-container">

                <div className="waiter-topbar">
                    <div className="orders-card" onClick={() => navigate("/orders")}>
                        Orders Today <span>{todayOrdersCount}</span>
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

                <div className="waiter-welcome">
                    <h2>Welcome, {user?.name || "Waiter"}</h2>
                    <p>Select a table to continue</p>
                </div>

                <div className="table-grid">
                    {tables.map((table) => (
                        <div
                            className="table-card"
                            key={table.id}
                            onClick={() => handleTableClick(table)}
                        >
                            <div className="table-title">
                                <span>Table {table.tableNumber}</span>

                                <span
                                    className={
                                        table.status === "Available"
                                            ? "status-dot green"
                                            : "status-dot orange"
                                    }
                                ></span>
                            </div>

                            <button
                                className={
                                    table.status === "Available"
                                        ? "table-btn assign"
                                        : "table-btn ordering"
                                }
                            >
                                {table.status}
                            </button>

                            
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default WaiterDashboard;