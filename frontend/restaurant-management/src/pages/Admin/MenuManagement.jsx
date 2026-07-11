import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import menuService from "../../services/menuService";
import "./Admin.css";
import "./Management.css";

function MenuManagement() {

    const [menu, setMenu] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const [form, setForm] = useState({
        itemName: "",
        categoryId: 1,
        price: "",
        isAvailable: true
    });

    useEffect(() => {
        loadMenu();

        const interval = setInterval(loadMenu, 5000);

        return () => clearInterval(interval);
    }, []);

    const loadMenu = async () => {
        const data = await menuService.getAllMenuItems();
        setMenu(data);
    };

    const openAddModal = () => {
        setEditingItem(null);

        setForm({
            itemName: "",
            categoryId: 1,
            price: "",
            isAvailable: true
        });

        setShowModal(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);

        setForm({
            itemName: item.name,
            categoryId: item.categoryId,
            price: item.price,
            isAvailable: item.isAvailable
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
            itemName: form.itemName.trim(),
            categoryId: Number(form.categoryId),
            price: Number(form.price),
            isAvailable: form.isAvailable
        };

        try {
            if (editingItem) {
                await menuService.updateMenuItem(editingItem.id, payload);
            } else {
                await menuService.addMenuItem(payload);
            }

            setShowModal(false);
            await loadMenu();
        } catch (error) {
            console.error(error);
            alert("Unable to save menu item.");
        }
    };

    


    const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
            "Are you sure you want to delete this menu item?"
        );

        if (!confirmDelete)
            return;

        await menuService.deleteMenuItem(id);

        loadMenu();
    };

    const filteredMenu = menu.filter(item => {

        const matchesSearch =
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.category.toLowerCase().includes(search.toLowerCase());

        const matchesFilter =
            filter === "All" ||
            (filter === "Available" && item.isAvailable) ||
            (filter === "Unavailable" && !item.isAvailable);

        return matchesSearch && matchesFilter;
    });

    
    return (
        <AdminLayout>

            <div className="management-header">
                <div>
                    <h1>Menu Management</h1>
                    <p>Manage food items, pricing, categories, and availability.</p>
                </div>

                <button className="primary-action-btn" onClick={openAddModal}>
                    + Add Menu Item
                </button>
            </div>

            

            <div className="management-toolbar">
                <input
                    className="management-search"
                    placeholder="Search food or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="management-filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="All">All Items</option>
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                </select>
            </div>

            <div className = "management-table-card">
                <table className="admin-table">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Food</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Availability</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {filteredMenu.map(item => (

                            <tr key={item.id}>
                                <td>
                                    <span className="id-badge">
                                        {item.id}
                                    </span>
                                </td>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>₹{item.price}</td>
                                <td>
                                    <span
                                        className={`status-pill ${
                                            item.isAvailable ? "success" : "danger"
                                        }`}
                                    >
                                        {item.isAvailable ? "Available" : "Unavailable"}
                                    </span>
                                </td>

                                <td>
                                    <div className="table-actions">
                                        <button
                                            className="action-btn edit-action"
                                            onClick={() => openEditModal(item)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="action-btn delete-action"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            Delete
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
                        <h2>
                            {editingItem ? "Edit Food" : "Add Food"}
                        </h2>

                        <form onSubmit={handleSave}>
                            <label>
                                Food Name
                                <input
                                    name="itemName"
                                    value={form.itemName}
                                    onChange={handleFormChange}
                                    required
                                />
                            </label>

                            <label>
                                Category
                                <select
                                    name="categoryId"
                                    value={form.categoryId}
                                    onChange={handleFormChange}
                                >
                                    <option value="1">Starters</option>
                                    <option value="2">Main</option>
                                    <option value="3">Drinks</option>
                                    <option value="4">Dessert</option>
                                </select>
                            </label>

                            <label>
                                Price
                                <input
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    name="price"
                                    value={form.price}
                                    onChange={handleFormChange}
                                    required
                                />
                            </label>

                            <label className="modal-checkbox">
                                <input
                                    type="checkbox"
                                    name="isAvailable"
                                    checked={form.isAvailable}
                                    onChange={handleFormChange}
                                />
                                Available
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

export default MenuManagement;