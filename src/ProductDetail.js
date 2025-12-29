import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // ✅ useSelector ઉમેર્યું
import { addItemToCart, removeItemFromCart } from "./store/cartSlice"; // ✅ removeItem પણ લાવ્યા

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ✅ કાર્ટમાંથી આઈટમ્સ મંગાવી લો
    const cartItems = useSelector((state) => state.cart.items);

    // FakeStoreAPI Call
    useEffect(() => {
        fetch(`https://fakestoreapi.com/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching product:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <h2 className="text-2xl font-bold text-gray-500 animate-pulse">Loading Product Details...</h2>
        </div>
    );

    if (!product) return (
        <div className="text-center mt-20 text-xl font-bold text-red-500">
            Product Not Found 😕
        </div>
    );

    // ✅ લાઈવ Quantity શોધો
    const cartItem = cartItems.find((item) => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen bg-white font-sans">

            {/* Back Button */}
            <button
                onClick={() => navigate("/")}
                className="mb-6 text-gray-500 hover:text-[#ff9900] font-bold flex items-center gap-2 transition-colors"
            >
                ← Back to Shop
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

                {/* LEFT: Big Image */}
                <div className="flex justify-center items-center bg-white rounded-xl p-8 border border-gray-100 shadow-sm h-[400px]">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="h-full object-contain hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* RIGHT: Product Info */}
                <div className="flex flex-col gap-5">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-bold w-fit uppercase tracking-wide">
                        {product.category}
                    </span>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                        {product.title}
                    </h1>

                    <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold text-green-600">
                            ${product.price}
                        </span>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded border border-yellow-100">
                            <span className="text-yellow-500 text-lg">⭐</span>
                            <span className="font-bold text-gray-700">
                                {product.rating?.rate}
                            </span>
                            <span className="text-gray-400 text-sm ml-1">
                                ({product.rating?.count} reviews)
                            </span>
                        </div>
                    </div>

                    <p className="text-gray-600 text-lg leading-relaxed border-t border-b py-4 my-2">
                        {product.description}
                    </p>

                    <div className="flex gap-6 text-sm text-gray-500 mb-4">
                        <p className="flex items-center gap-2">✅ <span className="font-bold text-gray-800">In Stock</span></p>
                        <p className="flex items-center gap-2">🚚 <span className="font-bold text-gray-800">Free Delivery</span></p>
                    </div>

                    {/* ✅ NEW: Button Logic (Add vs +/-) */}
                    {quantity === 0 ? (
                        // જો કાર્ટમાં ન હોય તો: મોટું બટન
                        <button
                            onClick={() => dispatch(addItemToCart(product))}
                            className="w-full md:w-2/3 bg-[#ff9900] text-white py-4 rounded-xl font-bold text-xl hover:bg-orange-600 shadow-lg active:scale-95 transition-all flex justify-center items-center gap-2"
                        >
                            <span>Add to Cart</span> 🛒
                        </button>
                    ) : (
                        // જો કાર્ટમાં હોય તો: Quantity Controls
                        <div className="w-full md:w-2/3 bg-gray-100 rounded-xl p-2 flex items-center justify-between border border-gray-200 shadow-inner">
                            <button
                                onClick={() => dispatch(removeItemFromCart(product.id))}
                                className="bg-white text-red-500 w-12 h-12 rounded-lg font-bold text-2xl shadow-sm hover:bg-red-50 transition-colors"
                            >
                                −
                            </button>

                            <span className="font-bold text-gray-900 text-2xl">
                                {quantity}
                            </span>

                            <button
                                onClick={() => dispatch(addItemToCart(product))}
                                className="bg-white text-green-600 w-12 h-12 rounded-lg font-bold text-2xl shadow-sm hover:bg-green-50 transition-colors"
                            >
                                +
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ProductDetail;