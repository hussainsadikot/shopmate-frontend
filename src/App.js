import React, { useEffect, useState } from "react";
import "./App.css";
import Shimmer from "./Shimmer";
import OrdersPage from "./OrdersPage";

// Redux Imports
import { useSelector, useDispatch } from "react-redux";
import { useGetProductsQuery } from "./store/apiSlice";
import { addItemToCart, removeItemFromCart, setCategory } from "./store/cartSlice"; // removeItem પણ import કરો
import CartPage from "./CartPage";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import ProductDetail from "./ProductDetail";
import CategoryBar from "./components/CategoryBar";


function App() {
  // it gives location to undestand where we are
  const location = useLocation();
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


  //  કેટેગરી માટે નવું સ્ટેટ
  // const [categories, setCategories] = useState(["All"]);
  // const [selectedCategory, setSelectedCategory] = useState("All");

  // now we made new category component
  const selectedCategory = useSelector((state) => state.cart.selectedCategory);

  // આ કેટેગરીનું લિસ્ટ છે (તમે API માંથી પણ લાવી શકો, પણ હમણાં હાર્ડકોડ કરીએ)




  // કાર્ટ પેજ બતાવવા માટેનું સ્ટેટ (Toggle)
  // const [showCartPage, setShowCartPage] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    // આ લાઈન જાદુ કરશે: કાર્ટના ડેટાને સ્ટ્રીંગ બનાવીને બ્રાઉઝરમાં સેવ કરશે
    localStorage.setItem("shopMateCart", JSON.stringify(cart));
  }, [cart]); // ડિપેન્ડન્સી: જ્યારે 'cart' બદલાય ત્યારે જ રન થશે


  useEffect(() => {
    if (apiProducts) {
      setDisplayList(apiProducts);
      const uniqueCategories = ["All", ...new Set(apiProducts.map(item => item.category))];

    }
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
      <header className="flex justify-between items-center p-5 bg-white shadow-md sticky top-0 z-50">

        {/* લોગો પર ક્લિક કરવાથી હોમ પેજ પર જવાય */}
        <h1 className="text-3xl font-bold text-[#ff9900] cursor-pointer tracking-tighter hover:scale-105 transition-transform duration-200"
          onClick={() => {
            dispatch(setCategory("All")); // ૧. કેટેગરી રીસેટ કરો
            setSearchTerm("");            // ૨. સર્ચ પણ સાફ કરો (જો હોય તો)
            navigate("/");                // ૩. હોમ પેજ પર જાઓ
          }} >ShopMate 🛍️</h1>

        <div className="flex gap-3 font-bold text-gray-700">
          <span>🛒 {totalQuantity}</span>
          <span>|</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>

        {/* સર્ચ બાર (આપણે ઈચ્છીએ તો ખાલી હોમ પેજ પર રાખી શકીએ, પણ અત્યારે અહીં રાખીએ) */}
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 w-[300px] rounded-md border border-gray-300 focus:outline-none focus:border-[#ff9900]"
        />

        {/* કાર્ટ બટન દબાવવાથી /cart પર જવાય */}
        <div
          onClick={() => navigate("/cart")}
          className="text-xl font-bold bg-[#ff9900] text-white py-2 px-5 rounded-md cursor-pointer hover:bg-orange-600 transition-colors">
          🛒 Cart ({cartCount})
        </div>




      </header>


      {/** ahi category nu filter area  */}
      {/* ✅ NEW CODE: Category Filter Buttons
      <div className="flex justify-center gap-4 p-6 bg-gray-50 flex-wrap sticky top-20 z-40 shadow-sm">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-bold capitalize transition-all transform hover:scale-105 ${selectedCategory === cat
              ? "bg-[#ff9900] text-white shadow-lg"  // સિલેક્ટેડ હોય તો ઓરેન્જ
              : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100" // નોર્મલ હોય તો સફેદ
              }`}
          >
            {cat}
          </button>
        ))}
      </div> */}
      {/* Use component*/}
      {/* <CategoryBar /> */}
      {/* જો path "/" હોય તો જ બતાવો */}
      {location.pathname === "/" && <CategoryBar />}


      {/* ૨. અહીં અસલી રાઉટીંગ થાય છે */}
      <Routes>
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/orders" element={<OrdersPage />} />
        {/* રૂટ ૧: હોમ પેજ (Product List) */}
        <Route path="/" element={
          isLoading ? (
            <Shimmer />
          ) : (

            // 1. Main Grid Container (Responsive Layout)
            <div className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 bg-gray-50 min-h-screen">

              {displayList
                // 2. Filter Logic (Search + Category)
                .filter((product) => {
                  // જો સર્ચ ટર્મ મેચ થાય અથવા કેટેગરી "All" હોય કે મેચ થતી હોય
                  const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
                  return matchesSearch && matchesCategory;
                })
                .map((product) => {

                  // 3. Quantity Check Logic
                  const quantity = getProductQuantity(product.id);

                  return (
                    <div
                      key={product.id}
                      className="bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between"
                    >
                      {/* Product Image */}
                      <div className="h-48 flex justify-center items-center overflow-hidden mb-4 bg-white rounded-lg"
                        onClick={() => navigate(`/product/${product.id}`)}

                      >
                        <img
                          src={product.image || product.thumbnail} // image અથવા thumbnail
                          alt={product.title}
                          className="h-full object-contain hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex flex-col gap-2 mb-4">
                        <h2 className="font-bold text-lg text-gray-800 line-clamp-1">
                          {product.title}
                        </h2>
                        <div className="flex justify-between items-center">
                          <span className="text-green-600 font-bold text-xl">
                            ${product.price}
                          </span>
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">
                            ⭐ {product.rating && product.rating.rate ? product.rating.rate : product.rating}
                          </span>
                        </div>
                      </div>

                      {/* 4. Button Logic (Add vs Quantity Controls) */}
                      {quantity === 0 ? (
                        // જો કાર્ટમાં ન હોય તો: ADD TO CART BUTTON
                        <button
                          onClick={() => dispatch(addItemToCart(product))}
                          className="w-full bg-[#ff9900] text-white font-bold py-2 rounded-lg hover:bg-orange-600 active:scale-95 transition-all shadow-md"
                        >
                          Add to Cart 🛒
                        </button>
                      ) : (
                        // જો કાર્ટમાં હોય તો: - 1 + CONTROLS
                        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-1 border border-gray-200">

                          {/* Minus Button */}
                          <button
                            onClick={() => dispatch(removeItemFromCart(product.id))}
                            className="bg-white text-red-500 hover:bg-red-500 hover:text-white w-8 h-8 rounded-md font-bold shadow-sm transition-colors"
                          >
                            -
                          </button>

                          {/* Quantity Display */}
                          <span className="font-bold text-gray-800 text-lg">
                            {quantity}
                          </span>

                          {/* Plus Button */}
                          <button
                            onClick={() => dispatch(addItemToCart(product))}
                            className="bg-white text-green-600 hover:bg-green-600 hover:text-white w-8 h-8 rounded-md font-bold shadow-sm transition-colors"
                          >
                            +
                          </button>
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