import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
    const orders = useSelector((state) => state.orders.history);
    const navigate = useNavigate();

    // ઉંધા ક્રમમાં (Latest first)
    const sortedOrders = [...orders].reverse();

    return (
        <div className="p-10 max-w-6xl mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">📋 Order Reports</h1>
                <button onClick={() => navigate("/")} className="text-[#ff9900] font-bold hover:underline">Back to Shop</button>
            </div>

            {orders.length === 0 ? (
                <p className="text-center text-gray-500 text-xl">No orders placed yet.</p>
            ) : (
                <div className="grid gap-6">
                    {sortedOrders.map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">

                            {/* Order Header */}
                            <div className="flex justify-between border-b pb-4 mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">Order #{order.id}</h3>
                                    <p className="text-sm text-gray-500">{order.date}</p>
                                </div>
                                <div className="text-right">
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                                        {order.status}
                                    </span>
                                    <p className="font-bold text-xl mt-1">₹{order.total.toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Customer Details */}
                            <div className="mb-4 bg-gray-50 p-3 rounded">
                                <p><strong>Customer:</strong> {order.customer.name} | 📞 {order.customer.mobile}</p>
                                <p className="text-sm text-gray-600">📍 {order.customer.address}</p>
                            </div>

                            {/* Items List */}
                            <div className="space-y-2">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm text-gray-700">
                                        <span>{item.quantity} x {item.title}</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;