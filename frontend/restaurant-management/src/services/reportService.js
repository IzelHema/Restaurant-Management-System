import api from "../api/axios";

const getSummary = async () => {
    const response = await api.get("/Reports/summary");
    return response.data;
};

export default {
    getSummary
};