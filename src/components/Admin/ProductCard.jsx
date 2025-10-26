// src/components/ProductCard.jsx
import React from "react";
import { FaHeart, FaCartPlus, FaBan } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebaseConfig";
import { addToCart, addToWishlist } from "../../utils/orderStorage";

export default function ProductCard({ product, handleDelete }) {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    if (!user) {
      alert("❌ Please log in first!");
      navigate('/login');
      return;
    }
    
    if (product.stock === 0) {
      alert("❌ Out of stock!");
      return;
    }

    const success = addToCart(user.uid, product);
    if (success) {
      alert("🛒 Added to cart!");
      // Trigger storage event to update dashboard
      window.dispatchEvent(new Event('storage'));
    } else {
      alert("❌ Failed to add to cart");
    }
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    
    if (!user) {
      alert("❌ Please log in first!");
      navigate('/login');
      return;
    }
    
    if (product.stock === 0) {
      alert("❌ Can't add out-of-stock items!");
      return;
    }

    const success = addToWishlist(user.uid, product);
    if (success) {
      alert("❤️ Added to wishlist!");
      // Trigger storage event to update dashboard
      window.dispatchEvent(new Event('storage'));
    } else {
      alert("ℹ️ Already in wishlist!");
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    
    if (!user) {
      alert("❌ Please log in first!");
      navigate('/login');
      return;
    }
    
    if (product.stock === 0) {
      alert("❌ Out of stock!");
      return;
    }

    // Add to cart and go to checkout
    addToCart(user.uid, product);
    navigate(`/checkout/${product.id}`);
  };

  const handleProductClick = () => {
    if (product.stock > 0) {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <div 
      className={`card h-100 shadow-sm product-card ${product.stock === 0 ? 'opacity-50' : ''}`} 
      onClick={handleProductClick} 
      style={{ 
        cursor: product.stock > 0 ? "pointer" : "not-allowed",
        position: "relative"
      }}
    >
      {/* Out of Stock Overlay */}
      {product.stock === 0 && (
        <div className="position-absolute top-50 start-50 translate-middle" style={{ zIndex: 1 }}>
          <div className="bg-danger text-white px-3 py-2 rounded shadow">
            <FaBan className="me-2" />
            Out of Stock
          </div>
        </div>
      )}
      
      <img
        src={product.image || "https://via.placeholder.com/220"}
        className="card-img-top p-3"
        alt={product.title || product.name}
        style={{ 
          height: "220px", 
          objectFit: "contain",
          filter: product.stock === 0 ? "grayscale(100%)" : "none"
        }}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/220";
        }}
      />
      <div className="card-body d-flex flex-column">
        <h6 className="card-title text-truncate">{product.title || product.name}</h6>
        <p className="card-text text-muted">${parseFloat(product.price).toFixed(2)}</p>
        <p className={`fw-bold ${product.stock > 0 ? "text-success" : "text-danger"}`}>
          {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
        </p>

        <div className="d-flex justify-content-between mb-2 mt-auto">
          <button
            className="btn btn-primary btn-sm"
            onClick={handleBuyNow}
            disabled={product.stock === 0}
          >
            <FaCartPlus className="me-1" /> Buy Now
          </button>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleAddToWishlist}
            disabled={product.stock === 0}
          >
            <FaHeart />
          </button>
        </div>

        {handleDelete && (
          <button className="btn btn-danger btn-sm w-100 mt-2" onClick={handleDelete}>
            Delete Product
          </button>
        )}
      </div>
    </div>
  );
}