import React, { useState } from "react";
import { updateCartQuantity, removeFromCart } from "../../utils/orderStorage";
import CartDetailsView from "./CartDetailsView";
import { FaList, FaCreditCard } from "react-icons/fa";

export default function CartTab({ cart, setCart, user, navigate }) {
  const [cartView, setCartView] = useState("details"); // Default to details view

  const handleUpdateCartQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const success = updateCartQuantity(user.uid, productId, newQuantity);
    if (success) {
      const updatedCart = cart.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
    }
  };

  const handleRemoveFromCart = (productId) => {
    const success = removeFromCart(user.uid, productId);
    if (success) {
      setCart(cart.filter(item => item.productId !== productId));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>🛒 Shopping Cart ({cart.length} items)</h4>
        {cart.length > 0 && (
          <div className="btn-group btn-group-sm">
            <button 
              className={`btn ${cartView === "details" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setCartView("details")}
            >
              <FaCreditCard className="me-1" /> Order Details
            </button>
          </div>
        )}
      </div>
      
      {cart.length === 0 ? (
        <div className="text-center py-5">
          <FaCreditCard size={48} className="text-muted mb-3" />
          <h5>Your cart is empty</h5>
          <p className="text-muted">Add some products to get started!</p>
          <button className="btn btn-primary" onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <CartDetailsView 
          cart={cart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveFromCart}
          onNavigateToCheckout={() => navigate("/checkout/cart")}
          onContinueShopping={() => navigate("/products")}
          showToggleButton={true}
          currentView={cartView}
          onViewChange={setCartView}
        />
      )}
    </div>
  );
}