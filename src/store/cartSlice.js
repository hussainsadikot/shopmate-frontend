// File: src/store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],      // કાર્ટની આઈટમ્સ
    totalQuantity: 0, // કુલ કેટલી વસ્તુ છે
    totalAmount: 0,   // કુલ કેટલા રૂપિયા થયા
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Action: કાર્ટમાં આઈટમ ઉમેરવી
        addItemToCart(state, action) {
            const newItem = action.payload;
            // ચેક કરો કે આઈટમ પહેલાથી છે કે નહીં
            const existingItem = state.items.find((item) => item.id === newItem.id);

            state.totalQuantity++;
            state.totalAmount = state.totalAmount + newItem.price;
            if (!existingItem) {
                // નવી આઈટમ હોય તો ઉમેરો
                state.items.push({
                    id: newItem.id,
                    title: newItem.title, // FakeStore માં 'title' હોય છે
                    price: newItem.price,
                    image: newItem.image,
                    quantity: 1,
                    totalPrice: newItem.price,
                });


            } else {
                // જૂની હોય તો કોન્ટીટી વધારો
                existingItem.quantity++;
                existingItem.totalPrice += newItem.price;

            }

        },
        // Action: કાર્ટમાંથી આઈટમ કાઢવી (તમે આ ફ્યુચરમાં વાપરી શકો)
        removeItemFromCart(state, action) {
            const id = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                state.totalQuantity--; // કુલ કોન્ટીટી ઘટાડો
                state.totalAmount = state.totalAmount - existingItem.price;
                if (existingItem.quantity === 1) {
                    // જો 1 જ હોય તો લિસ્ટમાંથી કાઢી નાખો
                    state.items = state.items.filter((item) => item.id !== id);
                } else {
                    // નહીંતર ખાલી કોન્ટીટી ઘટાડો
                    existingItem.quantity--;
                    existingItem.totalPrice -= existingItem.price;
                }
            }
        },
        // Action: કાર્ટ ખાલી કરવું
        clearCart(state) {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        }
    },
});

export const { addItemToCart, removeItemFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;