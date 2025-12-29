import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../store/cartSlice";

const AddToCartBtn = ({ product }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);

    // આ પ્રોડક્ટ કાર્ટમાં છે કે નહીં તે શોધો
    const cartItem = cartItems.find((item) => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    // જો 0 હોય તો Add બટન, નહિતર + -
    if (quantity === 0) {
        return (
            <button
                onClick={(e) => {
                    e.stopPropagation(); // આનાથી પેરેન્ટ પર ક્લિક નહીં થાય (Detail Page નહી ખુલે)
                    dispatch(addItemToCart(product));
                }}
                className="w-full bg-[#ff9900] text-white font-bold py-2 rounded-lg hover:bg-orange-600 active:scale-95 transition-all shadow-md z-50 relative"
            >
                Add to Cart 🛒
            </button>
        );
    }

    return (
        <div
            className="flex items-center justify-between bg-gray-100 rounded-lg p-1 border border-gray-200 w-full z-50 relative"
            onClick={(e) => e.stopPropagation()} // બટન દબાવતા ડિટેલ પેજ ન ખુલે તે માટે
        >
            <button
                onClick={() => dispatch(removeItemFromCart(product.id))}
                className="bg-white text-red-500 hover:bg-red-500 hover:text-white w-8 h-8 rounded-md font-bold shadow-sm transition-colors"
            >
                −
            </button>

            <span className="font-bold text-gray-800 text-lg">{quantity}</span>

            <button
                onClick={() => dispatch(addItemToCart(product))}
                className="bg-white text-green-600 hover:bg-green-600 hover:text-white w-8 h-8 rounded-md font-bold shadow-sm transition-colors"
            >
                +
            </button>
        </div>
    );
};

export default AddToCartBtn;