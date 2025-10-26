import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaArrowLeft } from "react-icons/fa";
import { addToCart, addToWishlist } from "../../utils/orderStorage";
import { auth } from "../../utils/firebaseConfig";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const user = auth.currentUser;

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      // First check admin products
      const adminProducts = JSON.parse(localStorage.getItem('adminProducts')) || [];
      const adminProduct = adminProducts.find(p => p.id.toString() === productId);
      
      if (adminProduct) {
        setProduct({
          ...adminProduct,
          source: 'admin',
          stock: adminProduct.stock || 0 // Ensure stock property exists
        });
      } else {
        // If not found in admin products, try API
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        if (response.ok) {
          const apiProduct = await response.json();
          setProduct({
            ...apiProduct,
            source: 'api',
            stock: 10 // Default stock for API products
          });
        } else {
          throw new Error('Product not found');
        }
      }
    } catch (error) {
      console.error("Error loading product:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      alert("Please log in to add items to cart");
      navigate("/login");
      return;
    }

    if (product.stock === 0) {
      alert("This product is out of stock!");
      return;
    }

    if (quantity > product.stock) {
      alert(`Only ${product.stock} items available in stock!`);
      return;
    }

    // Add multiple quantities
    for (let i = 0; i < quantity; i++) {
      addToCart(user.uid, product);
    }
    
    alert(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart!`);
  };

  const handleAddToWishlist = () => {
    if (!user) {
      alert("Please log in to add items to wishlist");
      navigate("/login");
      return;
    }

    if (product.stock === 0) {
      alert("Cannot add out-of-stock items to wishlist!");
      return;
    }

    const success = addToWishlist(user.uid, product);
    if (success) {
      alert("Product added to wishlist!");
    } else {
      alert("Product already in wishlist");
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      alert("Please log in to purchase items");
      navigate("/login");
      return;
    }

    if (product.stock === 0) {
      alert("This product is out of stock!");
      return;
    }

    if (quantity > product.stock) {
      alert(`Only ${product.stock} items available in stock!`);
      return;
    }

    // Add selected quantity to cart and proceed to checkout
    for (let i = 0; i < quantity; i++) {
      addToCart(user.uid, product);
    }
    navigate(`/checkout/${productId}`);
  };

  // Update quantity based on available stock
  const updateQuantity = (newQuantity) => {
    if (newQuantity > product.stock) {
      setQuantity(product.stock);
    } else if (newQuantity < 1) {
      setQuantity(1);
    } else {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          Product not found. It may have been removed or doesn't exist.
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/products")}>
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <button 
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate("/products")}
      >
        <FaArrowLeft className="me-2" />
        Back to Products
      </button>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <img
              src={product.image}
              alt={product.title}
              style={{
                width: "100%",
                height: "500px",
                objectFit: "contain",
                padding: "2rem"
              }}
              className="card-img-top"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/500x500/ffffff/666666?text=Product+Image";
              }}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              {/* Product Source Badge */}
              {product.source === 'admin' && (
                <span className="badge bg-success mb-3">Store Product</span>
              )}
              {product.source === 'api' && (
                <span className="badge bg-info mb-3">Featured Product</span>
              )}

              <h2 className="card-title">{product.title}</h2>
              
              <div className="d-flex align-items-center mb-3">
                <span className="h3 text-primary me-3">
                  ₹ {typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}
                </span>
                <div className="d-flex align-items-center">
                  <span className="text-warning me-1">⭐</span>
                  <span className="text-muted">
                    {product.rating?.rate || 4.5} ({product.rating?.count || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-3">
                <strong>Availability: </strong>
                <span className={product.stock > 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>

              <p className="card-text">{product.description}</p>

              <div className="mb-4">
                <strong>Category:</strong> {product.category}
              </div>

              {/* Quantity Selector - Only show if product is in stock */}
              {product.stock > 0 && (
                <div className="mb-4">
                  <label className="form-label"><strong>Quantity:</strong></label>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => updateQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="mx-3 fw-bold fs-5">{quantity}</span>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => updateQuantity(quantity + 1)}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  <small className="text-muted">
                    Maximum: {product.stock} items
                  </small>
                </div>
              )}

              <div className="d-grid gap-2">
                {product.stock > 0 ? (
                  <>
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={handleBuyNow}
                    >
                      Buy Now - ₹ {(product.price * quantity).toFixed(2)}
                    </button>
                    
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary flex-fill"
                        onClick={handleAddToCart}
                      >
                        <FaShoppingCart className="me-2" />
                        Add to Cart
                      </button>
                      <button
                        className="btn btn-outline-danger flex-fill"
                        onClick={handleAddToWishlist}
                      >
                        <FaHeart className="me-2" />
                        Add to Wishlist
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    className="btn btn-secondary btn-lg"
                    disabled
                  >
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;