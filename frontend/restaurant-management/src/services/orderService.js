import api from "../api/axios";

const createOrder = async (order) => {
    const response = await api.post("/Orders", order);
    return response.data;
};

const getPendingOrders = async () => {
    const response = await api.get("/Orders/pending");
    return response.data;
};

const getActiveOrders = async () => {
    const response = await api.get("/Orders/pending");
    return response.data;
};

const updateOrderItemStatus = async (orderItemId, kitchenStatus) => {
    const response = await api.put(`/Orders/items/${orderItemId}/status`, {
        kitchenStatus,
    });

    return response.data;
};

const getOrderById = async (orderId) => {
    const response = await api.get(`/Orders/${orderId}`);
    return response.data;
};

const markItemServed = async (orderItemId) => {
    const response = await api.put(`/Orders/items/${orderItemId}/served`);
    return response.data;
};

const completeOrder = async (orderId) => {
    const response = await api.put(`/Orders/${orderId}/complete`);
    return response.data;
};

const getTodayOrders = async () => {
    const response = await api.get("/Orders/today");
    return response.data;
};

const getAdminOrders = async () => {
    const response = await api.get("/Orders/admin");
    return response.data;
};



const orderService = {
    createOrder,
    getPendingOrders,
    getActiveOrders,
    updateOrderItemStatus,
    getOrderById,
    markItemServed,
    completeOrder,
    getTodayOrders,
    getAdminOrders,
};

export default orderService;