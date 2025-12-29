import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "orders",
    initialState: {
        history: JSON.parse(localStorage.getItem("shopMateOrders")) || [], // જૂના ઓર્ડર યાદ રાખશે
    },
    reducers: {
        placeOrder: (state, action) => {
            state.history.push(action.payload);
            // LocalStorage માં પણ સેવ કરીએ જેથી રિફ્રેશ થાય તો ઉડી ન જાય
            localStorage.setItem("shopMateOrders", JSON.stringify(state.history));
        },
        clearHistory: (state) => {
            state.history = [];
            localStorage.removeItem("shopMateOrders");
        },
    },
});

export const { placeOrder, clearHistory } = orderSlice.actions;
export default orderSlice.reducer;