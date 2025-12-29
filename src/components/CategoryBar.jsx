import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../store/cartSlice"; // Redux Action
import { useNavigate } from "react-router-dom";

const CategoryBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux માંથી કેટેગરી વાંચો
    const selectedCategory = useSelector((state) => state.cart.selectedCategory);

    const categories = ["All", "electronics", "jewelery", "men's clothing", "women's clothing"];

    const handleCategoryClick = (cat) => {
        dispatch(setCategory(cat)); // ૧. રેડક્સમાં કેટેગરી સેવ કરો
        navigate("/");              // ૨. હોમ પેજ પર મોકલો (જો કાર્ટમાં હોવ તો)
    };

    return (
        <div className="flex justify-center gap-4 p-6 bg-gray-50 flex-wrap sticky top-20 z-40 shadow-sm">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`px-4 py-2 rounded-full font-bold capitalize transition-all transform hover:scale-105 ${selectedCategory === cat
                        ? "bg-[#ff9900] text-white shadow-lg"
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default CategoryBar;