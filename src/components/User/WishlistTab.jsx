import React from "react";
import { removeFromWishlist, addToCart } from "../../utils/orderStorage";
import { FaShoppingCart, FaTrash } from "react-icons/fa";

const WishlistTab = ({ wishlist, setWishlist, user, navigate }) => {
  const handleRemoveFromWishlist = (productId) => {
    const success = removeFromWishlist(user.uid, productId);
    if (success) {
      setWishlist(wishlist.filter(item => item.productId !== productId));
    }
  };

  const handleAddToCartFromWishlist = (wishlistItem) => {
    const product = {
      id: wishlistItem.productId,
      title: wishlistItem.name,
      price: wishlistItem.price,
      image: wishlistItem.image
    };
    
    const success = addToCart(user.uid, product);
    if (success) {
      console.log("Added to cart from wishlist");
    }
  };

  return (
    <div>
      <h4 className="mb-4">❤️ Wishlist</h4>
      {wishlist.length === 0 ? (
        <div className="text-center py-5">
          ❤️
          <h5>Your wishlist is empty</h5>
          <p className="text-muted">Add some products you love!</p>
          <button className="btn btn-primary" onClick={() => navigate("/products")}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="row">
          {wishlist.map((item) => (
            <div key={item.productId} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <img 
                  src={item.image} 
                  alt={item.name}
                  style={{ height: "200px", objectFit: "contain" }}
                  className="card-img-top p-3"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200";
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title">{item.name}</h6>
                  <p className="card-text text-muted">${parseFloat(item.price).toFixed(2)}</p>
                  <div className="mt-auto d-grid gap-2">
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveFromWishlist(item.productId)}
                    >
                      <FaTrash className="me-1" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistTab;