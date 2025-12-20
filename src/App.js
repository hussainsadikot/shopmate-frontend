import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [displayList, setDisplayList] = useState([]);    // display data that requested
  const [searchTerm, setSearchTerm] = useState("");      // search query

  // API call that bring datafrom fakestore api
  useEffect(() => {
    axios.get("https://fakestoreapi.com/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => console.log("Error:", error));
  }, []);

  // debouncing search 
  useEffect(() => {
    // 500ms wait for user query
    const handler = setTimeout(() => {

      if (searchTerm === "") {
        setDisplayList(products); // if search bar is empty then display all products
      } else {
        // else filter product with user query in product title
        const filtered = products.filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDisplayList(filtered);
      }

    }, 500); // if user started typing something in search bar then wait for 500ms to call API  

    // clear time out function and data
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, products]); // if searchTerm changes then it should work again

  return (

    <div className="App">
      <h1>ShopMate 🛍️</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        style={{ padding: "10px", width: "300px", margin: "20px" }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Product List */}
      <div className="product-grid">
        {displayList.map((product) => (
          <div key={product.id} className="card">
            <img src={product.image} alt={product.title} width="100" />
            <h4>{product.title}</h4>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;