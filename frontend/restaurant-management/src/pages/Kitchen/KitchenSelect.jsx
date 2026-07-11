import { useNavigate } from "react-router-dom";
import { logout, getUser } from "../../utils/localStorage";
import "./KitchenSelect.css";

function KitchenSelect() {
    const navigate = useNavigate();
    const user = getUser();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="kitchen-select-page">
            <div className="kitchen-select-card">

                <div className="kitchen-select-header">
                    <span className="kitchen-select-logo">🍳</span>
                    <h1>Kitchen Workspace</h1>
                    <p>
                        Welcome, {user?.name || "Kitchen Staff"}
                    </p>
                </div>

                <div className="kitchen-device-grid">

                    <button
                        className="kitchen-device-card"
                        onClick={() => navigate("/kitchen/tv")}
                    >
                        <span className="device-icon">🖥️</span>

                        <div>
                            <h2>Kitchen TV</h2>
                            <p>
                                Large live order display for the kitchen
                            </p>
                        </div>
                    </button>

                    <button
                        className="kitchen-device-card"
                        onClick={() => navigate("/kitchen/device")}
                    >
                        <span className="device-icon">💻</span>

                        <div>
                            <h2>Kitchen Device</h2>
                            <p>
                                Update preparing, ready and served status
                            </p>
                        </div>
                    </button>

                </div>

                <button
                    className="kitchen-logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>
        </div>
    );
}

export default KitchenSelect;