import { createSlice } from '@reduxjs/toolkit';

// ૧. લોકલ સ્ટોરેજમાંથી ડેટા લાવવાનું ફંક્શન
const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem("shopMateCart");
    if (storedCart) {
        return JSON.parse(storedCart); // જો ડેટા હોય તો JSON માંથી ઓબ્જેક્ટ બનાવો
    }
    return {
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
        selectedCategory: "All",
    }; // જો ન હોય તો ખાલી રાખો
};

// ૨. initialState માં ફંક્શન કોલ કરો
const initialState = loadCartFromStorage();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {

        addItemToCart(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.id === newItem.id);

            state.totalQuantity++;
            state.totalAmount = state.totalAmount + newItem.price;

            if (!existingItem) {
                state.items.push({
                    id: newItem.id,
                    title: newItem.title,
                    price: newItem.price,
                    image: newItem.image,
                    quantity: 1,
                    totalPrice: newItem.price,
                });
            } else {
                existingItem.quantity++;
                existingItem.totalPrice += newItem.price;
            }

            // ૩. જ્યારે પણ કંઈક બદલાય, ત્યારે સેવ કરો
            // (Redux માં અહીં સાઈડ-ઈફેક્ટ કરવી સારી આદત નથી, પણ અત્યારે શીખવા માટે આપણે App.js માં સેવ કરીશું)
        },

        removeItemFromCart(state, action) {
            const id = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                state.totalQuantity--;
                state.totalAmount -= existingItem.price;

                if (existingItem.quantity === 1) {
                    state.items = state.items.filter(item => item.id !== id);
                } else {
                    existingItem.quantity--;
                    existingItem.totalPrice -= existingItem.price;
                }
            }
        },

        clearCart(state) {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        },
        setCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
    },
});

export const { addItemToCart, removeItemFromCart, clearCart, setCategory } = cartSlice.actions;
export default cartSlice.reducer;