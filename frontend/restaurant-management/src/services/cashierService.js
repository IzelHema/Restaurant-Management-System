import api from "../api/axios";

const getCompletedOrders = async () => {
    const response = await api.get("/Orders/completed");
    return response.data;
};

const getOrderBill = async (orderId) => {
    const response = await api.get(`/Orders/${orderId}`);
    return response.data;
}

const processPayment = async (orderId, paymentMode) => {
    const response = await api.post(`/Orders/${orderId}/payment`, {
        paymentMode,
    });

    return response.data;
};

const getPaymentHistory = async () => {
    const response = await api.get("/Orders/payment-history");
    return response.data;
};

const cashierService = {
    getCompletedOrders,
    getOrderBill,
    processPayment,
    getPaymentHistory,
};

export default cashierService;