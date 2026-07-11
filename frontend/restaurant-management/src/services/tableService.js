import api from "../api/axios";

const getTables = async () => {
    const response = await api.get("/Tables");
    return response.data;
};

const getAssignments = async () => {
    const response = await api.get("/Tables/assignments");
    return response.data;
};

const assignWaiter = async (tableId, waiterId) => {
    const response = await api.put(
        `/Tables/${tableId}/assign`,
        {
            waiterId
        }
    );

    return response.data;
};

const getTablesByWaiter = async (waiterId) => {
    const response = await api.get(`/Tables/waiter/${waiterId}`);
    return response.data;
};

const addTable = async (table) => {
    const response = await api.post("/Tables", table);
    return response.data;
};

const updateTable = async (id, table) => {
    const response = await api.put(`/Tables/${id}`, table);
    return response.data;
};

const tableService = {
    getTables,
    getAssignments,
    assignWaiter,
    getTablesByWaiter,
    addTable,
    updateTable,
};

export default tableService;