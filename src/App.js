import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);

  // API Call (Data Lavva Mate)
  useEffect(() => {
    axios.get("https://fakestoreapi.com/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => console.log("Error:", error));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>ShopMate Store 🛍️</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
        {products.map((item) => (
          <div key={item.id} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px", textAlign: "center" }}>
            <img src={item.image} alt={item.title} style={{ height: "100px", objectFit: "contain" }} />
            <h4 style={{ fontSize: "14px", margin: "10px 0" }}>{item.title.substring(0, 20)}...</h4>
            <p style={{ fontWeight: "bold", color: "green" }}>${item.price}</p>
            <button style={{ background: "black", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;