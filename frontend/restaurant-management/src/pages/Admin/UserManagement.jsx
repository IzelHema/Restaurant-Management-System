import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import userService from "../../services/userService";
import "./Admin.css";
import "./Management.css";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "Waiter",
        isActive: true
    });

    useEffect(() => {
        loadUsers();

        const interval = setInterval(loadUsers, 5000);

        return () => clearInterval(interval);
    }, []);

    const loadUsers = async () => {
        try {
            const data = await userService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error("LOAD USERS ERROR:", error);
        }
    };

    const openAddModal = () => {
        setEditingUser(null);

        setForm({
            name: "",
            email: "",
            password: "",
            role: "Waiter",
            isActive: true
        });

        setShowModal(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);

        setForm({
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            isActive: user.isActive
        });

        setShowModal(true);
    };

    const handleFormChange = (event) => {
        const { name, value, type, checked } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSave = async (event) => {
        event.preventDefault();

        const payload = {
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            role: form.role,
            isActive: form.isActive
        };

        try {
            if (editingUser) {
                await userService.updateUser(editingUser.id, payload);
            } else {
                await userService.addUser(payload);
            }

            setShowModal(false);
            await loadUsers();
        } catch (error) {
            console.error("SAVE USER ERROR:", error);
            alert("Unable to save user.");
        }
    };

    

    const filteredUsers = users.filter(user => {
        const query = search.toLowerCase();

        const matchesSearch =
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.role.toLowerCase().includes(query);

        const matchesFilter =
            filter === "All" ||
            (filter === "Active" && user.isActive) ||
            (filter === "Inactive" && !user.isActive);

        return matchesSearch && matchesFilter;
    });

    const toggleUserStatus = async (user) => {
        const payload = {
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            isActive: !user.isActive
        };

        try {
            await userService.updateUser(user.id, payload);
            await loadUsers();
        } catch (error) {
            console.error("STATUS UPDATE ERROR:", error);
            alert("Unable to update user status.");
        }
    };

    return (
        <AdminLayout>
            <div className="management-header">

                <div>

                    <h1>User Management</h1>

                    <p>
                        Manage restaurant staff accounts and access.
                    </p>

                </div>

                <button
                    className="primary-action-btn"
                    onClick={openAddModal}
                >
                    + Add User
                </button>

            </div>

            <div className="management-toolbar">
                <input
                    className="management-search"
                    placeholder="Search name, email or role"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />

                <select
                    className="management-filter"
                    value={filter}
                    onChange={(e)=>setFilter(e.target.value)}
                >
                    <option value="All">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Waiter">Waiter</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Cashier">Cashier</option>
                </select>

                <select
                    className="management-filter"
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            <div className="management-table-card">


                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <span className="id-badge">{user.id}</span>
                                </td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-pill ${user.role.toLowerCase()}`}>{user.role}</span>
                                </td>

                                <td>
                                    <span
                                        className={`status-pill ${
                                            user.isActive
                                                ? "availability available"
                                                : "availability unavailable"
                                        }`}
                                    >
                                        {user.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>

                                <td>
                                    <div className="table-actions">

                                        <button className="action-btn edit-action">
                                            Edit
                                        </button>

                                        <button
                                            className={`action-btn ${
                                                user.isActive
                                                    ? "delete-action"
                                                    : "success-action"
                                            }`}
                                            onClick={()=>toggleUserStatus(user)}
                                        >
                                            {user.isActive ? "Deactivate" : "Activate"}
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
                        <h2>{editingUser ? "Edit User" : "Add User"}</h2>

                        <form onSubmit={handleSave}>
                            <label>
                                Name
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleFormChange}
                                    required
                                />
                            </label>

                            <label>
                                Email
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleFormChange}
                                    required
                                />
                            </label>

                            <label>
                                Password
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleFormChange}
                                    required={!editingUser}
                                    placeholder={
                                        editingUser
                                            ? "Enter current or new password"
                                            : ""
                                    }
                                />
                            </label>

                            <label>
                                Role
                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={handleFormChange}
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Waiter">Waiter</option>
                                    <option value="Kitchen">Kitchen</option>
                                    <option value="Cashier">Cashier</option>
                                </select>
                            </label>

                            <label className="modal-checkbox">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={form.isActive}
                                    onChange={handleFormChange}
                                />
                                Active
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

export default UserManagement;