import { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Search, Plus, Minus, X, User, LogOut, Package } from 'lucide-react';
import AuthContext, { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Payment from './pages/Payment';
import Orders from './pages/Orders';
import { useCart } from './hooks/useCart';
import './App.css';

const API_URL = 'http://localhost:8000/api';

// PrivateRoute Component
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/" />;
};

function MainApp() {
  const { user, logoutUser } = useContext(AuthContext);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cart, cartTotal, addToCart, updateQuantity, fetchCart } = useCart(user);
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Only fetch if user is logged in
    if (!user) return;
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime();
        const [resRes, catRes] = await Promise.all([
          axios.get(`${API_URL}/restaurants/?t=${timestamp}`),
          axios.get(`${API_URL}/categories/?t=${timestamp}`)
        ]);
        setRestaurants(resRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [user]);

  // Sync cart emptying from Payment
  useEffect(() => {
      const handleClearCart = () => fetchCart(); // Re-fetch cart when cleared from backend
      window.addEventListener('clearCart', handleClearCart);
      return () => window.removeEventListener('clearCart', handleClearCart);
  }, [fetchCart]);

  const handleCheckoutClick = () => {
      setIsCartOpen(false);
      navigate('/payment', { state: { cart, totalAmount: cartTotal } });
      // When navigating away, clear cart in App.jsx AFTER successful payment (Handled locally in actual prod by Redux, here we just listen to event)
  };

  return (
    <div className="app-container">
      {/* Navbar Shared Across Pages */}
      <nav className={`navbar ${scrolled ? 'glass' : ''}`}>
        <div className="container">
          <Link to={user ? "/home" : "/"} className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="32" height="32" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M512 85.3333C276.363 85.3333 85.3334 276.363 85.3334 512C85.3334 747.637 276.363 938.667 512 938.667C747.637 938.667 938.667 747.637 938.667 512C938.667 276.363 747.637 85.3333 512 85.3333ZM512 853.333C323.509 853.333 170.667 700.491 170.667 512C170.667 323.509 323.509 170.667 512 170.667C700.491 170.667 853.333 323.509 853.333 512C853.333 700.491 700.491 853.333 512 853.333Z" fill="#FF5A00"/>
              <path d="M682.667 426.667C650.08 426.667 618.336 439.04 594.133 461.355C569.931 439.04 538.187 426.667 505.6 426.667C473.013 426.667 441.269 439.04 417.067 461.355C392.864 439.04 361.12 426.667 328.533 426.667C269.664 426.667 213.333 469.739 213.333 533.333C213.333 605.312 284.149 676.128 355.605 727.605L505.6 832.555L655.595 727.605C727.051 676.128 797.867 605.312 797.867 533.333C797.867 469.739 741.536 426.667 682.667 426.667Z" fill="#FF5A00"/>
              <path d="M384 256C384 232.435 403.104 213.333 426.667 213.333C450.229 213.333 469.333 232.435 469.333 256V341.333C469.333 364.896 450.229 384 426.667 384C403.104 384 384 364.896 384 341.333V256Z" fill="#FF0055"/>
              <path d="M554.667 213.333C531.104 213.333 512 232.435 512 256V341.333C512 364.896 531.104 384 554.667 384C578.229 384 597.333 364.896 597.333 341.333V256C597.333 232.435 578.229 213.333 554.667 213.333Z" fill="#FF0055"/>
            </svg>
            <span style={{ color: "var(--primary)", fontWeight: "800", fontSize: '24px', letterSpacing: '-0.5px' }}>CraveBites</span>
          </Link>
          
          <div className="nav-links">
            {user ? (
                <>
                    <Link to="/home" className="nav-item">Offers</Link>
                    <Link to="/orders" className="nav-item" style={{display: 'flex', alignItems: 'center', gap: '6px'}}><Package size={18}/> Orders</Link>
                    <button onClick={logoutUser} className="nav-item" style={{display: 'flex', alignItems: 'center', gap: '6px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '16px'}}>
                        <LogOut size={18} /> Logout
                    </button>
                    <button className="btn-primary" onClick={() => setIsCartOpen(true)}>
                      <ShoppingBag size={20} />
                      <span>{cart.length > 0 ? Object.values(cart).reduce((a,b)=>a+b.quantity,0) : 'Cart'}</span>
                    </button>
                </>
            ) : (
                <Link to="/login" className="btn-primary">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Router */}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
        <Route path="/home" element={<PrivateRoute><Home categories={categories} restaurants={restaurants} addToCart={addToCart} cart={cart} updateQuantity={updateQuantity} /></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
      </Routes>

      {/* Cart Overlay Shared Across Pages */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h2>Your Cart</h2>
            <button className="close-btn" onClick={() => setIsCartOpen(false)}>
              <X size={24} />
            </button>
          </div>
          
          <div className="cart-items">
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>
                <ShoppingBag size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <p>Your cart is empty.</p>
                <p>Add some delicious meals!</p>
              </div>
            ) : (
              cart.map(item => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80"} className="cart-item-img" alt={item.name} />
                  <div className="cart-item-details">
                    <div className="cart-item-title">{item.name}</div>
                    <div className="cart-item-price">₹{item.price}</div>
                    <div className="quantity-controls">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}><Minus size={16} /></button>
                      <span>{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}><Plus size={16} /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <button className="btn-primary btn-block" onClick={handleCheckoutClick}>
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <MainApp />
            </AuthProvider>
        </Router>
    );
}

export default App;
