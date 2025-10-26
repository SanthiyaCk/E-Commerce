import React, { useState, useEffect } from "react";
import { auth } from "../../utils/firebaseConfig";
import { getUserOrders, getCart, getWishlist } from "../../utils/orderStorage";
import { FaUser, FaRedo } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import CartTab from "./CartTab";
import WishlistTab from "./WishlistTab";
import OrdersTab from "./OrderTab";

const UserDashboard = () => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("cart");
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      loadAllData();
      
      // Check URL for tab parameter
      const urlParams = new URLSearchParams(location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam && ['cart', 'wishlist', 'orders'].includes(tabParam)) {
        setActiveTab(tabParam);
      }

      // Listen for storage changes
      const handleStorageChange = () => {
        console.log("🔄 Storage changed, reloading data...");
        loadAllData();
      };
      
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('localStorageChange', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('localStorageChange', handleStorageChange);
      };
    }
  }, [user, location]);

  const loadAllData = () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const userCart = getCart(user.uid);
      const userWishlist = getWishlist(user.uid);
      const userOrders = getUserOrders(user.uid);
      
      console.log("📊 Data loaded:", {
        cart: userCart.length,
        wishlist: userWishlist.length,
        orders: userOrders.length
      });
      
      setCart(userCart || []);
      setWishlist(userWishlist || []);
      setOrders(userOrders || []);
      
    } catch (error) {
      console.error("❌ Error loading data:", error);
      setCart([]);
      setWishlist([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadAllData();
  };

  if (!user) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Please log in to view your dashboard.</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">My Dashboard</h2>
          <p className="text-muted mb-0">
            <FaUser className="me-1" />
            Welcome back, {user.displayName || user.email}
          </p>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={refreshData}>
          <FaRedo className="me-1" />
          Refresh
        </button>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === "cart" ? "active" : ""}`}
            onClick={() => setActiveTab("cart")}
          >
            🛒 Shopping Cart 
            <span className="badge bg-primary ms-2">{cart.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === "wishlist" ? "active" : ""}`}
            onClick={() => setActiveTab("wishlist")}
          >
            ❤️ Wishlist 
            <span className="badge bg-danger ms-2">{wishlist.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            📦 Order History 
            <span className="badge bg-success ms-2">{orders.length}</span>
          </button>
        </li>
      </ul>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your data...</p>
        </div>
      )}

      {/* Content based on active tab */}
      {!loading && (
        <>
          {activeTab === "cart" && (
            <CartTab 
              cart={cart} 
              setCart={setCart}
              user={user}
              navigate={navigate}
            />
          )}
          {activeTab === "wishlist" && (
            <WishlistTab 
              wishlist={wishlist} 
              setWishlist={setWishlist}
              user={user}
              navigate={navigate}
            />
          )}
          {activeTab === "orders" && (
            <OrdersTab 
              orders={orders}
              navigate={navigate}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserDashboard;