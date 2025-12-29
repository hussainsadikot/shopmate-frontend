// File: src/CartPage.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
// Redux માંથી actions મંગાવી લો
import { addItemToCart, removeItemFromCart, clearCart } from "./store/cartSlice";
import { placeOrder } from "./store/orderSlice";
import { useNavigate } from "react-router-dom";

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

    //nevigetor
    const navigate = useNavigate();

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

        // alert(`Order Placed Successfully for ₹${grandTotal.toFixed(2)}! \nThank you, ${formData.name}! 🎉`);
        // ૧. ઓર્ડર ઓબ્જેક્ટ તૈયાર કરો
        const newOrder = {
            id: Date.now(), // યુનિક ID
            date: new Date().toLocaleString(),
            customer: formData,
            items: cartItems,
            total: grandTotal,
            status: "Pending"
        };

        // ૨. Redux માં ઓર્ડર સેવ કરો
        dispatch(placeOrder(newOrder));

        alert("Order Placed Successfully! ✅");

        // કાર્ટ ખાલી કરો
        dispatch(clearCart());
        navigate("/orders");   // ૩. રિપોર્ટ પેજ પર લઈ જાઓ (આપણે હજુ બનાવવાનું બાકી છે)
    };

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h2 className="text-3xl font-bold text-gray-400 mb-4">Your Cart is Empty! 😞</h2>
                <p className="text-gray-500 mb-6">Order placed or no items added.</p>
                <button onClick={() => window.location.reload()} className="bg-[#ff9900] text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-md">Go to Home</button>
            </div>
        );
    }

    return (
        <div className="p-5 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 font-sans">

            {/* LEFT SIDE: items OR Checkout Form */}
            <div className="flex-[2]">

                {showCheckout ? (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">📦 Shipping Details</h3>
                        <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
                            <input
                                type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange}
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff9900] focus:ring-1 focus:ring-[#ff9900]"
                            />
                            <input
                                type="text" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleInputChange}
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff9900] focus:ring-1 focus:ring-[#ff9900]"
                            />
                            <textarea
                                name="address" placeholder="Delivery Address" value={formData.address} onChange={handleInputChange}
                                className="p-3 border border-gray-300 rounded-lg h-24 focus:outline-none focus:border-[#ff9900] focus:ring-1 focus:ring-[#ff9900]"
                            />

                            <button type="submit" className="mt-2 w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition shadow-md">
                                CONFIRM ORDER - ₹{grandTotal.toFixed(2)}
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowCheckout(false)}
                                className="text-red-500 font-semibold hover:underline text-sm text-center mt-2"
                            >
                                Cancel & Go Back
                            </button>
                        </form>
                    </div>
                ) : (
                    // CART ITEMS LIST DESIGN
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b font-bold text-gray-700">
                            Your Cart Items ({cartItems.length})
                        </div>
                        <div className="divide-y divide-gray-100">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                                    <div className="flex items-center gap-4">
                                        <img src={item.image} alt={item.title} className="w-16 h-16 object-contain bg-white rounded-md border p-1" />
                                        <div>
                                            <h4 className="font-bold text-gray-800 line-clamp-1 w-40 sm:w-auto">{item.title}</h4>
                                            <small className="text-gray-500 font-bold">${item.price}</small>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 bg-gray-100 px-3 py-1 rounded-full">
                                        <button onClick={() => dispatch(removeItemFromCart(item.id))} className="text-gray-600 hover:text-black font-bold px-2">-</button>
                                        <span className="font-semibold text-gray-800">{item.quantity}</span>
                                        <button onClick={() => dispatch(addItemToCart(item))} className="text-gray-600 hover:text-black font-bold px-2">+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT SIDE: Bill Details (Sticky) */}
            <div className="flex-1 min-w-[300px]">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-24">
                    <h3 className="text-xl font-bold border-b pb-3 mb-4 text-gray-800">Bill Details</h3>

                    <div className="flex justify-between mb-2 text-gray-600">
                        <span>Item Total</span> <span>${itemTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-gray-600">
                        <span>GST (18%)</span> <span>${gstAmount.toFixed(2)}</span>
                    </div>
                    <div className={`flex justify-between mb-4 ${deliveryFee === 0 ? 'text-green-600 font-bold' : 'text-gray-600'}`}>
                        <span>Delivery Fee</span>
                        <span>{deliveryFee === 0 ? "FREE" : `$${deliveryFee}`}</span>
                    </div>

                    <hr className="border-dashed my-4" />

                    <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                        <span>To Pay</span>
                        <span>${grandTotal.toFixed(2)}</span>
                    </div>

                    {!showCheckout && (
                        <button
                            onClick={() => setShowCheckout(true)}
                            className="w-full bg-[#ff9900] text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-md active:scale-95"
                        >
                            PROCEED TO PAY
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartPage;