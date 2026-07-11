import api from "../api/axios";

const getUsers = async () => {
    const response = await api.get("/Users");
    return response.data;
};

const addUser = async (user) => {
    const response = await api.post("/Users", user);
    return response.data;
};

const updateUser = async (id, user) => {
    const response = await api.put(`/Users/${id}`, user);
    return response.data;
};

const deleteUser = async (id) => {
    const response = await api.delete(`/Users/${id}`);
    return response.data;
};

export default {
    getUsers,
    addUser,
    updateUser,
    deleteUser
};