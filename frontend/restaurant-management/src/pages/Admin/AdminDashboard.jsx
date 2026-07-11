import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import reportService from "../../services/reportService";
import tableService from "../../services/tableService";
import "./Admin.css";
import "./Dashboard.css";
import {
    FaClipboardList,
    FaMoneyBillWave,
    FaChair,
    FaClock
} from "react-icons/fa";

function AdminDashboard() {
    const navigate = useNavigate();

    const [summary, setSummary] = useState({
        todayOrders: 0,
        pendingOrders: 0,
        todayRevenue: 0,
        activeTables: 0
    });

    const [tables, setTables] = useState([]);

    const loadDashboard = async () => {
        try {
            const [summaryData, tableData] = await Promise.all([
                reportService.getSummary(),
                tableService.getAssignments()
            ]);

            setSummary(summaryData);
            setTables(tableData);
        } catch (error) {
            console.error("DASHBOARD LOAD ERROR:", error);
        }
    };

    useEffect(() => {
        loadDashboard();

        const interval = setInterval(loadDashboard, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <AdminLayout>
            <div classname="dashboard-page">
                <div className="dashboard-header">

                <div>
                    <h1>Restaurant Dashboard</h1>
                    
                </div>

                <div className="dashboard-live">
                    <span className="dashboard-live-dot"></span>
                    Auto Refresh • 5 sec
                </div>

            </div>

                <div className="dashboard-cards">

                    <div className="dashboard-card">

                        <div className="dashboard-card-top">
                            <h3>Today's Orders</h3>

                            <div className="dashboard-card-icon">
                                <FaClipboardList />
                            </div>
                        </div>

                        <h2>{summary.todayOrders}</h2>

                    </div>

                    <div className="dashboard-card">

                        <div className="dashboard-card-top">
                            <h3>Revenue</h3>

                            <div className="dashboard-card-icon">
                                <FaMoneyBillWave />
                            </div>
                        </div>

                        <h2>₹ {summary.todayRevenue}</h2>

                    </div>

                    <div className="dashboard-card">

                        <div className="dashboard-card-top">
                            <h3>Pending Orders</h3>

                            <div className="dashboard-card-icon">
                                <FaClock />
                            </div>
                        </div>

                        <h2>{summary.pendingOrders}</h2>

                    </div>

                    <div className="dashboard-card">

                        <div className="dashboard-card-top">
                            <h3>Active Tables</h3>

                            <div className="dashboard-card-icon">
                                <FaChair />
                            </div>
                        </div>

                        <h2>{summary.activeTables}</h2>

                    </div>

                </div>

                <div className="live-table-section">
                    <div className="live-table-section-header">

                        <div>

                            <h2>Live Restaurant Tables</h2>

                            <small>
                                Click a table to view its active order.
                            </small>

                        </div>

                    </div>

                    <div className="live-table-grid">
                        {tables.map((table) => (
                            <div
                                className={`live-table-card ${
                                    table.status === "Ordering"
                                        ? "ordering"
                                        : "available"
                                }`}
                                key={table.tableId}
                                onClick={() => {
                                    if (table.activeOrderId) {
                                        navigate(`/admin/orders/${table.activeOrderId}`);
                                    } else {
                                        alert("No active order for this table.");
                                    }
                                }}
                            >

                                <div className="live-table-title">

                                    <h3>
                                        🍽 Table {table.tableNumber}
                                    </h3>

                                </div>

                                <div className="live-table-info">

                                    <p>
                                        <strong>Waiter</strong><br />
                                        {table.assignedWaiterName || "Unassigned"}
                                    </p>

                                    <p>
                                        <strong>Capacity</strong><br />
                                        {table.capacity} Seats
                                    </p>

                                </div>

                                <div
                                    className={
                                        table.status === "Ordering"
                                            ? "dashboard-status ordering"
                                            : "dashboard-status available"
                                    }
                                >
                                    {table.status}
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminDashboard;