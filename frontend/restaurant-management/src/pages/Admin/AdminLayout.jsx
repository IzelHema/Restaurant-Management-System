import { useLocation, useNavigate } from "react-router-dom";
import {
    FaChartPie,
    FaUtensils,
    FaChair,
    FaClipboardList,
    FaUsers,
    FaSignOutAlt
} from "react-icons/fa";

import { logout } from "../../utils/localStorage";
import "./Admin.css";

function AdminLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const isActive = (path) => {
        if (path === "/admin") {
            return location.pathname === "/admin";
        }

        return location.pathname.startsWith(path);
    };

    return (
        <div className="admin-page">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <div className="admin-brand-icon">D</div>

                    <div>
                        <h2>DineFlow</h2>
                        <span>Admin Panel</span>
                    </div>
                </div>

                <nav className="admin-nav">
                    <button
                        className={isActive("/admin") ? "active" : ""}
                        onClick={() => navigate("/admin")}
                    >
                        <FaChartPie />
                        Dashboard
                    </button>

                    <button
                        className={isActive("/admin/menu") ? "active" : ""}
                        onClick={() => navigate("/admin/menu")}
                    >
                        <FaUtensils />
                        Menu
                    </button>

                    <button
                        className={isActive("/admin/tables") ? "active" : ""}
                        onClick={() => navigate("/admin/tables")}
                    >
                        <FaChair />
                        Tables
                    </button>

                    <button
                        className={isActive("/admin/orders") ? "active" : ""}
                        onClick={() => navigate("/admin/orders")}
                    >
                        <FaClipboardList />
                        Orders
                    </button>

                    <button
                        className={isActive("/admin/users") ? "active" : ""}
                        onClick={() => navigate("/admin/users")}
                    >
                        <FaUsers />
                        Users
                    </button>
                </nav>

                <div className="admin-sidebar-footer">
                    <button
                        className="admin-logout-btn"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt />
                        Logout
                    </button>
                </div>
            </aside>

            <main className="admin-content">
                {children}
            </main>
        </div>
    );
}

export default AdminLayout;