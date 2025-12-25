import React, { useEffect, useState } from "react";
import "./App.css";
import Shimmer from "./Shimmer";

// Redux Imports
import { useSelector, useDispatch } from "react-redux";
import { useGetProductsQuery } from "./store/apiSlice";
import { addItemToCart, removeItemFromCart } from "./store/cartSlice"; // removeItem પણ import કરો
import CartPage from "./CartPage";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

function App() {
  const { data: apiProducts, isLoading } = useGetProductsQuery();
  const dispatch = useDispatch();

  // ✅ કાર્ટની બધી આઈટમ્સ મંગાવો જેથી આપણે ચેક કરી શકીએ
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = useSelector((state) => state.cart.totalQuantity);
  const { totalQuantity, totalAmount } = useSelector((state) => state.cart);
  //cart data retrived from local storage.
  const cart = useSelector((state) => state.cart);
  const [displayList, setDisplayList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // કાર્ટ પેજ બતાવવા માટેનું સ્ટેટ (Toggle)
  // const [showCartPage, setShowCartPage] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    // આ લાઈન જાદુ કરશે: કાર્ટના ડેટાને સ્ટ્રીંગ બનાવીને બ્રાઉઝરમાં સેવ કરશે
    localStorage.setItem("shopMateCart", JSON.stringify(cart));
  }, [cart]); // ડિપેન્ડન્સી: જ્યારે 'cart' બદલાય ત્યારે જ રન થશે


  useEffect(() => {
    if (apiProducts) setDisplayList(apiProducts);
  }, [apiProducts]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!apiProducts) return;
      if (searchTerm === "") {
        setDisplayList(apiProducts);
      } else {
        const filtered = apiProducts.filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDisplayList(filtered);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, apiProducts]);

  // ✅ Helper Function: પ્રોડક્ટની Quantity શોધવા માટે
  const getProductQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="App">
      {/* હેડર હંમેશા દેખાવું જોઈએ */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", background: "#f8f9fa", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>

        {/* લોગો પર ક્લિક કરવાથી હોમ પેજ પર જવાય */}
        <h1 onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>ShopMate 🛍️</h1>

        <div style={{ display: 'flex', gap: '10px', fontWeight: 'bold' }}>
          <span>🛒 {totalQuantity}</span>
          <span>|</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>

        {/* સર્ચ બાર (આપણે ઈચ્છીએ તો ખાલી હોમ પેજ પર રાખી શકીએ, પણ અત્યારે અહીં રાખીએ) */}
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "10px", width: "300px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        {/* કાર્ટ બટન દબાવવાથી /cart પર જવાય */}
        <div
          onClick={() => navigate("/cart")}
          style={{ fontSize: "1.2rem", fontWeight: "bold", backgroundColor: "#ff9900", color: "white", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}>
          🛒 Cart ({cartCount})
        </div>
      </header>

      {/* ✅ ૨. અહીં અસલી રાઉટીંગ થાય છે */}
      <Routes>

        {/* રૂટ ૧: હોમ પેજ (Product List) */}
        <Route path="/" element={
          isLoading ? (
            <Shimmer />
          ) : (
            <div className="product-grid" style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center", padding: "20px" }}>
              {displayList.map((product) => {
                const quantity = getProductQuantity(product.id);
                return (
                  <div key={product.id} className="card" style={{ border: "1px solid #ddd", padding: "15px", width: "250px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <img src={product.image} alt={product.title} style={{ height: "150px", objectFit: "contain", margin: "0 auto" }} />
                    <h4 style={{ margin: "10px 0", fontSize: "16px" }}>{product.title.slice(0, 20)}...</h4>
                    <p style={{ fontWeight: "bold", color: "green" }}>${product.price}</p>

                    {quantity === 0 ? (
                      <button
                        onClick={() => dispatch(addItemToCart(product))}
                        style={{ backgroundColor: "#ff9900", color: "white", border: "none", padding: "10px", borderRadius: "5px", cursor: "pointer", width: "100%" }}>
                        Add to Cart 🛒
                      </button>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#eee", borderRadius: "5px", padding: "5px" }}>
                        <button
                          onClick={() => dispatch(removeItemFromCart(product.id))}
                          style={{ background: "#ff4d4d", color: "white", border: "none", padding: "5px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: 'bold' }}> - </button>
                        <span style={{ fontWeight: "bold", fontSize: "18px" }}>{quantity}</span>
                        <button
                          onClick={() => dispatch(addItemToCart(product))}
                          style={{ background: "#4CAF50", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontWeight: 'bold' }}> + </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        } />

        {/* રૂટ ૨: કાર્ટ પેજ */}
        <Route path="/cart" element={<CartPage cartItems={cartItems} />} />

      </Routes>
    </div>
  );
}




export default App;