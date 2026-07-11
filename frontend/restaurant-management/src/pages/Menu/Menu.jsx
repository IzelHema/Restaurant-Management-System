
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import menuService from "../../services/menuService";

import orderService from "../../services/orderService";

import { FaHome } from "react-icons/fa";
import { HiClipboardDocumentList } from "react-icons/hi2";

import "./Menu.css";

function Menu() {
    const navigate = useNavigate();
    const { tableId } = useParams();

    const [quantities, setQuantities] = useState({});

    const [menuItems, setMenuItems] = useState([]);

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const [todayOrdersCount, setTodayOrdersCount] = useState(0);

    useEffect(() => {
        loadMenu();
        loadTodayOrdersCount();

        const interval = setInterval(loadMenu, 5000);

        return () => clearInterval(interval);
    }, []);

    const loadTodayOrdersCount = async () => {
        try {
            const data = await orderService.getTodayOrders();
            setTodayOrdersCount(data.length);
        } catch (error) {
            console.error("TODAY ORDERS COUNT ERROR:", error);
        }
    };

    const loadMenu = async () => {
        try {
            const data = await menuService.getMenuItems();
            setMenuItems(data);
        }
        catch (error) {
            console.error("LOAD MENU ERROR:", error);
        }
    };

    const increaseQty = (id) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: (prev[id] || 0) + 1,
        }));
    };

    const decreaseQty = (id) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.max((prev[id] || 0) - 1, 0),
        }));
    };

    const addToCart = () => {

        const existingCart = JSON.parse(
            localStorage.getItem(`cart_table_${tableId}`)
        ) || [];

        const selectedItems = menuItems
            .filter(item => quantities[item.id] > 0)
            .map(item => ({
                ...item,
                qty: quantities[item.id]
            }));

        selectedItems.forEach(newItem => {

            const existingItem = existingCart.find(
                item => item.id === newItem.id
            );

            if(existingItem){

                existingItem.qty += newItem.qty;

            }else{

                existingCart.push(newItem);

            }

        });

        localStorage.setItem(
            `cart_table_${tableId}`,
            JSON.stringify(existingCart)
        );

        navigate(`/cart/${tableId}`);

    };

    const filteredMenuItems = menuItems.filter((item) => {
        const itemName = (item.name ?? "").toLowerCase();
        const itemCategory = (item.category ?? "").toLowerCase();
        const searchText = search.trim().toLowerCase();

        const matchesSearch =
            itemName.includes(searchText) ||
            itemCategory.includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            itemCategory === selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="menu-page">
            <div className="menu-container">

                <div className="menu-topbar">
                    <div className="orders-card" onClick={() => navigate("/orders")}>
                        Orders Today <span>{todayOrdersCount}</span>
                    </div>

                    <div className="top-icons">
                        <FaHome
                            className="icon"
                            onClick={() => navigate("/waiter")}
                        />

                        <HiClipboardDocumentList
                            className="icon"
                            onClick={() => navigate("/order-status")}
                        />
                    </div>
                </div>

                <div className="menu-search-wrap">
                    <input
                        className="menu-search"
                        type="text"
                        placeholder="Search menu items..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <span>🔍</span>
                </div>

                <div className="menu-tabs">
                    {["All", "Starters", "Main", "Drinks", "Dessert"].map((category) => (
                        <button
                            type="button"
                            key={category}
                            className={
                                selectedCategory === category
                                    ? "menu-tab active"
                                    : "menu-tab"
                            }
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="menu-grid">
                    {filteredMenuItems.map((item) => (
                        <div className="menu-card" key={item.id}>
                            

                            <p className="food-name">{item.name}</p>
                            <p className="food-price">₹{item.price}</p>

                            <div className="qty-box">
                                <button onClick={() => decreaseQty(item.id)}>-</button>
                                <span>{quantities[item.id] || 0}</span>
                                <button onClick={() => increaseQty(item.id)}>+</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="menu-bottom">
                    <button onClick={() => navigate(`/cart/${tableId}`)}>← Back</button>
                    <button onClick={addToCart}>Add to table cart</button>
                </div>

            </div>
        </div>
    );
}

export default Menu;