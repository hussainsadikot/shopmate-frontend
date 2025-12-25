// File: src/CartPage.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
// Redux માંથી actions મંગાવી લો
import { addItemToCart, removeItemFromCart, clearCart } from "./store/cartSlice";

const CartPage = ({ cartItems }) => {
    const dispatch = useDispatch(); // App.js માંથી dispatch ન મોકલો તો અહીં બનાવી લેવું પડે

    // ૧. સ્ટેટ (State) - ફોર્મ બતાવવા માટે
    const [showCheckout, setShowCheckout] = useState(false);

    // ૨. ફોર્મ ડેટા સાચવવા માટે
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        address: ""
    });

    const itemTotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);
    const gstAmount = itemTotal * 0.18;
    const deliveryFee = itemTotal > 500 ? 0 : 40;
    const grandTotal = itemTotal + gstAmount + deliveryFee;

    // ૩. ફોર્મ ભરતી વખતે ડેટા અપડેટ કરવાનું ફંક્શન
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ૪. ઓર્ડર કન્ફર્મ કરવાનું લોજિક
    const handlePlaceOrder = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.mobile || !formData.address) {
            alert("Please fill all details! (બધી વિગત ભરો)");
            return;
        }

        alert(`Order Placed Successfully for ₹${grandTotal.toFixed(2)}! \nThank you, ${formData.name}! 🎉`);

        // કાર્ટ ખાલી કરો
        dispatch(clearCart());
    };

    if (cartItems.length === 0) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>Your Cart is Empty! 😞</h2>
                <p>Order placed or no items added.</p>
                <button onClick={() => window.location.reload()} style={{ padding: '10px', cursor: 'pointer' }}>Go to Home</button>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

            {/* LEFT SIDE: items OR Checkout Form */}
            <div style={{ flex: 2, minWidth: '300px' }}>

                {showCheckout ? (
                    <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px' }}>
                        <h3>📦 Shipping Details</h3>
                        <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input
                                type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange}
                                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                            />
                            <input
                                type="text" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleInputChange}
                                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                            />
                            <textarea
                                name="address" placeholder="Delivery Address" value={formData.address} onChange={handleInputChange}
                                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', height: '80px' }}
                            />

                            <button type="submit" style={{ padding: '15px', background: '#28a745', color: 'white', border: 'none', fontWeight: 'bold', borderRadius: '5px', cursor: 'pointer' }}>
                                CONFIRM ORDER - ₹{grandTotal.toFixed(2)}
                            </button>

                            <button type="button" onClick={() => setShowCheckout(false)} style={{ padding: '10px', background: 'transparent', color: 'red', border: 'none', cursor: 'pointer' }}>
                                Cancel & Go Back
                            </button>
                        </form>
                    </div>
                ) : (
                    <div style={{ border: '1px solid #eee', borderRadius: '10px', padding: '10px' }}>
                        <h2>Your Cart Items ({cartItems.length})</h2>
                        {cartItems.map((item) => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', padding: '15px 0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <img src={item.image} alt={item.title} style={{ width: "50px", height: "50px", objectFit: "contain" }} />
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '14px' }}>{item.title.slice(0, 20)}...</h4>
                                        <small style={{ color: 'gray' }}>${item.price}</small>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <button onClick={() => dispatch(removeItemFromCart(item.id))} style={{ background: "#eee", border: "none", padding: "5px 10px", cursor: 'pointer' }}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => dispatch(addItemToCart(item))} style={{ background: "#eee", border: "none", padding: "5px 10px", cursor: 'pointer' }}>+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT SIDE: Bill Details */}
            <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ position: 'sticky', top: '20px', border: '1px solid #eee', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <h3>Bill Details</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span>Item Total</span> <span>${itemTotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span>GST (18%)</span> <span>${gstAmount.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: deliveryFee === 0 ? 'green' : 'black' }}>
                        <span>Delivery Fee</span> <span>{deliveryFee === 0 ? "FREE" : `$${deliveryFee}`}</span>
                    </div>
                    <hr />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
                        <span>To Pay</span> <span>${grandTotal.toFixed(2)}</span>
                    </div>

                    {!showCheckout && (
                        <button
                            onClick={() => setShowCheckout(true)}
                            style={{ width: '100%', padding: '15px', background: '#fc8019', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', borderRadius: '5px', cursor: 'pointer' }}>
                            PROCEED TO PAY
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartPage;