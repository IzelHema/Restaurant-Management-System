import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import tableService from "../../services/tableService";
import userService from "../../services/userService";
import "./Admin.css";
import "./Management.css";

function TableAssignment() {

    const [tables, setTables] = useState([]);
    const [waiters, setWaiters] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [search, setSearch] = useState("");

    const [assignmentFilter, setAssignmentFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const [form, setForm] = useState({
        tableNumber: "",
        capacity: "",
        status: "Available"
    });

    useEffect(() => {
        loadData();

        const interval = setInterval(loadData, 5000);

        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {

        const tableData = await tableService.getAssignments();

        const userData = await userService.getUsers();

        setTables(tableData);

        setWaiters(
            userData.filter(
                user =>
                    user.role === "Waiter" &&
                    user.isActive
            )
        );
    };

    const handleAssignmentChange = async (tableId, value) => {
        try {
            const waiterId = value === "" ? null : Number(value);

            await tableService.assignWaiter(tableId, waiterId);

            await loadData();
        } catch (error) {
            console.error("ASSIGNMENT ERROR:", error);
            alert("Unable to update table assignment.");
        }
    };

    const openAddModal = () => {
        setEditingTable(null);

        setForm({
            tableNumber: "",
            capacity: "",
            status: "Available"
        });

        setShowModal(true);
    };

    const openEditModal = (table) => {
        setEditingTable(table);

        setForm({
            tableNumber: table.tableNumber,
            capacity: table.capacity,
            status: table.status
        });

        setShowModal(true);
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSave = async (event) => {
        event.preventDefault();

        const payload = {
            tableNumber: Number(form.tableNumber),
            capacity: Number(form.capacity),
            status: form.status
        };

        try {
            if (editingTable) {
                await tableService.updateTable(editingTable.tableId, payload);
            } else {
                await tableService.addTable(payload);
            }

            setShowModal(false);
            await loadData();
        } catch (error) {
            console.error("TABLE SAVE ERROR:", error);
            alert("Unable to save table.");
        }
    };

    const filteredTables = tables.filter(table => {

        const waiterName = table.assignedWaiterName ?? "";

        const matchesSearch =
            table.tableNumber.toString().includes(search) ||
            waiterName.toLowerCase().includes(search.toLowerCase());

        const matchesAssignment =
            assignmentFilter === "All" ||
            (assignmentFilter === "Assigned" && table.assignedWaiterId !== null) ||
            (assignmentFilter === "Unassigned" && table.assignedWaiterId === null);

        const matchesStatus =
            statusFilter === "All" ||
            table.status === statusFilter;

        return (
            matchesSearch &&
            matchesAssignment &&
            matchesStatus
        );

    });

    return (
        <AdminLayout>

            <div className="management-header">
                <div>
                    <h1>Table Management</h1>
                    <p>Manage restaurant tables, capacity, status, and waiter assignments.</p>
                </div>

                <button
                    className="primary-action-btn"
                    onClick={openAddModal}
                >
                    + Add Table
                </button>
            </div>

            <div className="management-toolbar">

                <input
                    className="management-search"
                    placeholder="Search table or waiter..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="management-filter"
                    value={assignmentFilter}
                    onChange={(e) => setAssignmentFilter(e.target.value)}
                >
                    <option value="All">All Assignments</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Unassigned">Unassigned</option>
                </select>

                <select
                    className="management-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="Available">Available</option>
                    
                    <option value="Ordering">Ordering</option>
                    
                </select>

            </div>

            <div className="management-table-card">

                <table className="admin-table">

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Table</th>
                            <th>Capacity</th>
                            <th>Status</th>
                            <th>Assigned Waiter</th>
                            <th>Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {filteredTables.map(table => (

                            <tr key={table.tableId}>
                                <td>
                                    <span className="id-badge">
                                        {table.tableId}
                                    </span>
                                </td>

                                <td>
                                    <strong>Table {table.tableNumber}</strong>
                                </td>

                                <td>{table.capacity} Seats</td>

                                <td>
                                    <span
                                        className={`status-pill ${
                                            table.status === "Ordering"
                                                ? "warning"
                                                : "success"
                                        }`}
                                    >
                                        {table.status}
                                    </span>
                                </td>

                                <td>
                                    <select
                                        className="waiter-select"
                                        value={table.assignedWaiterId ?? ""}
                                        onChange={(event) =>
                                            handleAssignmentChange(
                                                table.tableId,
                                                event.target.value
                                            )
                                        }
                                    >
                                        <option value="">Unassigned</option>

                                        {waiters.map(waiter => (
                                            <option
                                                key={waiter.id}
                                                value={waiter.id}
                                            >
                                                {waiter.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                <td>
                                    <div className="table-actions">
                                        <button
                                            className="action-btn edit-action"
                                            onClick={() => openEditModal(table)}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </td>
                            </tr>

                        ))}

                    </tbody>

                </table>
            </div>

            {showModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h2>{editingTable ? "Edit Table" : "Add Table"}</h2>

                        <form onSubmit={handleSave}>
                            <label>
                                Table Number
                                <input
                                    type="number"
                                    name="tableNumber"
                                    value={form.tableNumber}
                                    onChange={handleFormChange}
                                    required
                                />
                            </label>

                            <label>
                                Capacity
                                <input
                                    type="number"
                                    name="capacity"
                                    min="1"
                                    value={form.capacity}
                                    onChange={handleFormChange}
                                    required
                                />
                            </label>

                            <label>
                                Status
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleFormChange}
                                >
                                    <option value="Available">Available</option>
                                    
                                    <option value="Ordering">Ordering</option>
                                    
                                </select>
                            </label>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="modal-cancel-btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="modal-save-btn"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}

export default TableAssignment;