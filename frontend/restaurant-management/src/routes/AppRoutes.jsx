import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login/Login";

import WaiterDashboard from "../pages/WaiterDashboard/WaiterDashboard";

import Cart from "../pages/Cart/Cart";

import Menu from "../pages/Menu/Menu";

import KitchenTV from "../pages/Kitchen/KitchenTV";

import KitchenDevice from "../pages/Kitchen/KitchenDevice";

import OrderStatus from "../pages/OrderStatus/OrderStatus";

import OrderStatusDetails from "../pages/OrderStatus/OrderStatusDetails";

import CashierOrders from "../pages/Cashier/CashierOrders";

import CashierBill from "../pages/Cashier/CashierBill";

import OrdersHistory from "../pages/WaiterDashboard/OrdersHistory";

import OrdersHistoryDetails from "../pages/WaiterDashboard/OrdersHistoryDetails";

import CashierHistory from "../pages/Cashier/CashierHistory";

import KitchenSelect from "../pages/Kitchen/KitchenSelect";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import MenuManagement from "../pages/Admin/MenuManagement";
import UserManagement from "../pages/Admin/UserManagement";
import TableAssignment from "../pages/Admin/TableAssignment";

import AdminOrders from "../pages/Admin/AdminOrders";

import AdminOrderDetails from "../pages/Admin/AdminOrderDetails";

function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route path="/waiter" element={<WaiterDashboard />} />


                <Route path="/cart/:tableId" element={<Cart />} />

                <Route path="/menu/:tableId" element={<Menu />} />

                <Route path="/kitchen" element={<KitchenSelect />} />
                
                <Route path="/kitchen/tv" element={<KitchenTV />} />

                <Route path="/kitchen/device" element={<KitchenDevice />} />

                <Route path="/order-status" element={<OrderStatus />} />

                <Route path="/order-status/:orderId" element={<OrderStatusDetails />} />

                <Route path="/cashier" element={<CashierOrders />} />

                <Route path="/cashier/orders/:orderId" element={<CashierBill />} />

                <Route path="/orders" element={<OrdersHistory />} />

                <Route path="/orders/:orderId" element={<OrdersHistoryDetails />} />
            
                <Route path="/cashier/history" element={<CashierHistory />} />


                <Route path="/admin" element={<AdminDashboard />} />
                <Route
                    path="/admin/dashboard"
                    element={<Navigate to="/admin" replace />}
                />

                <Route path="/admin/menu" element={<MenuManagement />} />
                
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/tables" element={<TableAssignment />} />

                <Route path="/admin/orders" element={<AdminOrders />} />
            
                <Route path="/admin/orders/:orderId" element={<AdminOrderDetails />} />
            </Routes>

            

        </BrowserRouter>
    );
}

export default AppRoutes;