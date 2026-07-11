import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import orderService from "../../services/orderService";
import {getUser} from "../../utils/localStorage";

import { FaHome } from "react-icons/fa";
import { HiClipboardDocumentList } from "react-icons/hi2";

import "./Cart.css";

function Cart() {
    const navigate = useNavigate();
    const { tableId } = useParams();
    const [message, setMessage] = useState("");

    const handleSendToKitchen = async () => {
        if (cartItems.length === 0) {
            setMessage("Please add items before sending to kitchen");
            return;
        }

        const user = getUser();

        const orderRequest = {
            tableId: Number(tableId),
            waiterId: user.userId,
            items: cartItems.map((item) => ({
                itemId: item.id,
                quantity: item.qty,
            })),
        };

        try {
            const response = await orderService.createOrder(orderRequest);

            setMessage(response.message || "Order sent to kitchen successfully.");

            localStorage.removeItem(`cart_table_${tableId}`);
            
            setTimeout(() => {
            localStorage.removeItem(`cart_table_${tableId}`);
            navigate("/waiter");
        }, 1200);
        } catch (error) {
            console.error(error);
            setMessage("Failed to send order to kitchen");
        }
    };
    

    const [cartItems, setCartItems] = useState([]);

    const total = cartItems.reduce(

        (sum, item) => sum + item.price * item.qty,

        0

    );

    const updateCart = (updatedItems) => {
        setCartItems(updatedItems);
        localStorage.setItem(`cart_table_${tableId}`, JSON.stringify(updatedItems));
    };

    const increaseQty = (id) => {
        const updatedItems = cartItems.map((item) =>
            item.id === id ? { ...item, qty: item.qty + 1 } : item
        );

        updateCart(updatedItems);
    };

    const decreaseQty = (id) => {
        const updatedItems = cartItems
            .map((item) =>
                item.id === id ? { ...item, qty: item.qty - 1 } : item
            )
            .filter((item) => item.qty > 0);

        updateCart(updatedItems);
    };

    const removeItem = (id) => {
        const updatedItems = cartItems.filter((item) => item.id !== id);
        updateCart(updatedItems);
    };

    useEffect(() => {

        const items = JSON.parse(
            localStorage.getItem(`cart_table_${tableId}`)
        ) || [];

        setCartItems(items);

    }, [tableId]);

    

    return (
        
        <div className="cart-page">
            <div className="cart-container">

                <div className="cart-topbar">
                    <div className="orders-card" onClick={() => navigate("/orders")}>
                        Orders Today 
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

                <div className="cart-actions">
                    <div className="table-label">Table {tableId} Orders</div>

                    <button
                        className="cart-back-btn"
                        onClick={() => navigate("/waiter")}
                    >
                        ← Back
                    </button>
                </div>

                <div className="cart-content">
                    {cartItems.length === 0 ? (

                        <p className="empty-text">
                            No orders yet!
                        </p>

                    ) : (

                        cartItems.map((item) => (

                            <div
                                className="cart-item"
                                key={item.id}
                            >

                                <div>

                                    <h4>{item.name}</h4>

                                    <small>₹ {item.price}</small>

                                </div>

                                <div className="cart-qty-actions">
                                    <button onClick={() => decreaseQty(item.id)}>-</button>
                                    <span>{item.qty}</span>
                                    <button onClick={() => increaseQty(item.id)}>+</button>
                                    <button onClick={() => removeItem(item.id)}>Delete</button>
                                </div>

                            </div>

                        ))

                    )}
                </div>

                <div className="cart-total">
                    <span>Total</span>
                    <span>₹ {total}</span>
                </div>

                <div className="cart-bottom">
                    <button
                        className="add-items-btn"
                        onClick={() => navigate(`/menu/${tableId}`)}
                    >
                        + Add Items
                    </button>

                    {message && (
                        <div className="success-message">
                            {message}
                        </div>
                    )}

                    <button
                        className="send-kitchen-btn"
                        onClick={handleSendToKitchen} >
                        Send to Kitchen
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Cart;