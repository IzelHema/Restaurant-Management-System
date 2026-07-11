import api from "../api/axios";

const getMenuItems = async () => {
    const response = await api.get("/Menu");
    return response.data;
};

const addMenuItem = async (item) => {
    const response = await api.post("/Menu", item);
    return response.data;
};

const updateMenuItem = async (id, item) => {
    const response = await api.put(`/Menu/${id}`, item);
    return response.data;
};

const deleteMenuItem = async (id) => {
    const response = await api.delete(`/Menu/${id}`);
    return response.data;
};

const getAllMenuItems = async () => {
    const response = await api.get("/Menu/admin");
    return response.data;
};

const menuService = {
    getMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getAllMenuItems,
};

export default menuService;