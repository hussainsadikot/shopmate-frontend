import React, { useEffect, useState } from "react";
import "./App.css";
import Shimmer from "./Shimmer";

// Redux Imports
import { useSelector, useDispatch } from "react-redux";
import { useGetProductsQuery } from "./store/apiSlice";
import { addItemToCart, removeItemFromCart } from "./store/cartSlice"; // removeItem પણ import કરો

function App() {
  const { data: apiProducts, isLoading } = useGetProductsQuery();
  const dispatch = useDispatch();

  // ✅ કાર્ટની બધી આઈટમ્સ મંગાવો જેથી આપણે ચેક કરી શકીએ
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = useSelector((state) => state.cart.totalQuantity);
  const { totalQuantity, totalAmount } = useSelector((state) => state.cart);

  const [displayList, setDisplayList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // કાર્ટ પેજ બતાવવા માટેનું સ્ટેટ (Toggle)
  const [showCartPage, setShowCartPage] = useState(false);

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
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", background: "#f8f9fa", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
        <h1 onClick={() => setShowCartPage(false)} style={{ cursor: 'pointer' }}>ShopMate 🛍️</h1>
        {/* કાર્ટ આઈકોન અને કોન્ટીટી */}
        <span>🛒 {totalQuantity}</span>

        {/* ✅ પાઈપ | નિશાની */}
        <span>|</span>

        {/* ✅ કુલ રૂપિયા (માત્ર 2 પોઈન્ટ સુધી) */}
        <span>₹{totalAmount.toFixed(2)}</span>

        {!showCartPage && (
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "10px", width: "300px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        )}

        {/* કાર્ટ પર ક્લિક કરવાથી પેજ બદલાશે */}
        <div
          onClick={() => setShowCartPage(true)}
          style={{ fontSize: "1.2rem", fontWeight: "bold", backgroundColor: "#ff9900", color: "white", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}>
          🛒 Cart ({cartCount})
        </div>
      </header>

      {/* Conditional Rendering: જો showCartPage True હોય તો કાર્ટ બતાવો, નહીંતર પ્રોડક્ટ લિસ્ટ */}

      {showCartPage ? (
        <CartPage cartItems={cartItems} dispatch={dispatch} />
      ) : (
        /* Product Listing Page */
        isLoading ? (
          <Shimmer />
        ) : (
          <div className="product-grid" style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center", padding: "20px" }}>
            {displayList.map((product) => {
              const quantity = getProductQuantity(product.id); // આ પ્રોડક્ટની કોન્ટીટી મેળવો

              return (
                <div key={product.id} className="card" style={{ border: "1px solid #ddd", padding: "15px", width: "250px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                  <img src={product.image} alt={product.title} style={{ height: "150px", objectFit: "contain", margin: "0 auto" }} />
                  <h4 style={{ margin: "10px 0", fontSize: "16px" }}>{product.title.slice(0, 20)}...</h4>
                  <p style={{ fontWeight: "bold", color: "green" }}>${product.price}</p>

                  {/* ✅ બટનનું જાદુઈ લોજિક (Button Logic) */}
                  {quantity === 0 ? (
                    // જો કાર્ટમાં ન હોય તો ADD બટન
                    <button
                      onClick={() => dispatch(addItemToCart(product))}
                      style={{ backgroundColor: "#ff9900", color: "white", border: "none", padding: "10px", borderRadius: "5px", cursor: "pointer", width: "100%" }}>
                      Add to Cart 🛒
                    </button>
                  ) : (
                    // જો કાર્ટમાં હોય તો - 1 + બટન
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#eee", borderRadius: "5px", padding: "5px" }}>
                      <button
                        onClick={() => dispatch(removeItemFromCart(product.id))}
                        style={{ background: "#ff4d4d", color: "white", border: "none", padding: "5px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: 'bold' }}>
                        -
                      </button>
                      <span style={{ fontWeight: "bold", fontSize: "18px" }}>{quantity}</span>
                      <button
                        onClick={() => dispatch(addItemToCart(product))}
                        style={{ background: "#4CAF50", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontWeight: 'bold' }}>
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}

// 🛒 Step 3: Cart Page Component (આને તમે અલગ ફાઈલમાં પણ મૂકી શકો છો)
// અત્યારે સરળતા માટે અહીં જ નીચે લખ્યો છે
const CartPage = ({ cartItems, dispatch }) => {

  // કુલ રકમ ગણવા માટે (Redux માં પણ છે, પણ અહીં લાઈવ ગણી લઈએ)
  const grandTotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);

  if (cartItems.length === 0) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}><h2>Your Cart is Empty! 😞</h2></div>
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Your Cart Items</h2>
      {cartItems.map((item) => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ccc', padding: '15px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img src={item.image} alt={item.title} style={{ width: "60px", height: "60px", objectFit: "contain" }} />
            <div>
              <h4>{item.title.slice(0, 30)}...</h4>
              <p>${item.price} x {item.quantity}</p>
            </div>
          </div>

          {/* + - Buttons in Cart Page too */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => dispatch(removeItemFromCart(item.id))}
              style={{ background: "#ff4d4d", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>-</button>
            <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
            <button
              onClick={() => dispatch(addItemToCart(item))}
              style={{ background: "#4CAF50", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>+</button>
          </div>

          <div style={{ fontWeight: 'bold' }}>
            ${item.totalPrice.toFixed(2)}
          </div>
        </div>
      ))}

      <div style={{ textAlign: 'right', marginTop: '20px', fontSize: '1.5rem', fontWeight: 'bold' }}>
        Total: ${grandTotal.toFixed(2)}
      </div>
      <button style={{ width: '100%', padding: '15px', background: '#28a745', color: 'white', border: 'none', fontSize: '1.2rem', marginTop: '20px', borderRadius: '5px', cursor: 'pointer' }}>
        Proceed to Checkout
      </button>
    </div>
  );
};

export default App;