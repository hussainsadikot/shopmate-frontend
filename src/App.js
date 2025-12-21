import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Shimmer from "./Shimmer";


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

  // 4. function that is most imortant in all ecom it's addtocart handler
  const handleAddToCart = (product) => {
    console.log("Added to cart:", product.title);
    // after implementing redux wite dispatch(addToCart(product)) 
    // alert me with product title
    // alert(`${product.title} added to cart! 🛒`);
  };
  //testing shimmer layout
  // if (products.length === 0) {
  //   return <Shimmer />
  // }

  return (

    <div className="App">
      <header>
        <h1>ShopMate 🛍️</h1>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search for products..."
          className="search-box"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "12px", width: "300px", margin: "20px", borderRadius: "8px", border: "1px solid #ddd" }}
        />
      </header>

      {/* product grid */}
      {/*if product is fetching at that moment we wanted to show shimmer */}
      {/*conditional rendering of cards */}
      {(products.length === 0 ? (<Shimmer />) : (<div className="product-grid" style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {displayList.map((product) => (
          <div key={product.id} className="card" style={{ border: "1px solid #ddd", padding: "15px", width: "250px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>

            {/* product image */}
            <img src={product.image} alt={product.title} style={{ height: "150px", objectFit: "contain" }} />

            {/* title */}
            <h4 style={{ margin: "10px 0", fontSize: "16px" }}>{product.title.slice(0, 20)}...</h4>

            {/* price */}
            <p style={{ fontWeight: "bold", color: "green" }}>${product.price}</p>

            {/* add to cart button added*/}
            <button
              onClick={() => handleAddToCart(product)}
              style={{
                backgroundColor: "#ff9900",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%"
              }}
            >
              Add to Cart 🛒
            </button>

          </div>
        ))}
      </div>))}
    </div>
  );
}

export default App;