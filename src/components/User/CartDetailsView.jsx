import React, { useState } from "react";
import { FaTrash, FaList, FaCreditCard, FaPlus, FaMinus, FaEye, FaTimes } from "react-icons/fa";

const CartDetailsView = ({ 
  cart, 
  onUpdateQuantity,
  onRemoveItem, 
  onNavigateToCheckout, 
  onContinueShopping
}) => {
  const [showSimpleView, setShowSimpleView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const calculateCartSubtotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.quantity)), 0);
    return subtotal.toFixed(2);
  };

  const calculateTax = () => {
    const subtotal = parseFloat(calculateCartSubtotal());
    return (subtotal * 0.1).toFixed(2);
  };

  const calculateShipping = () => {
    const subtotal = parseFloat(calculateCartSubtotal());
    return subtotal > 50 ? "0.00" : "5.99";
  };

  const calculateFinalTotal = () => {
    const subtotal = parseFloat(calculateCartSubtotal());
    const tax = parseFloat(calculateTax());
    const shipping = parseFloat(calculateShipping());
    return (subtotal + tax + shipping).toFixed(2);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  // Product Detail Modal
  const ProductDetailModal = () => {
    if (!selectedProduct) return null;

    return (
      <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">Product Details</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={closeProductModal}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    style={{ 
                      width: "100%", 
                      height: "300px", 
                      objectFit: "contain" 
                    }}
                    className="rounded border p-3"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300/ffffff/666666?text=Product+Image";
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <h4 className="fw-bold text-dark mb-3">{selectedProduct.name}</h4>
                  
                  <div className="mb-4">
                    <h3 className="text-primary fw-bold mb-2">
                      ₹ {parseFloat(selectedProduct.price).toFixed(2)}
                    </h3>
                    <div className="d-flex align-items-center mb-3">
                      <span className="badge bg-success me-2">In Stock</span>
                      <span className="text-muted">Available for purchase</span>
                    </div>
                  </div>

                  <div className="border-top pt-3">
                    <h6 className="fw-semibold mb-3">Order Details</h6>
                    <div className="row">
                      <div className="col-6">
                        <small className="text-muted">Quantity in Cart</small>
                        <div className="fw-bold fs-5">{selectedProduct.quantity}</div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Item Total</small>
                        <div className="fw-bold fs-5 text-primary">
                          ₹ {(parseFloat(selectedProduct.price) * parseInt(selectedProduct.quantity)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="btn-group w-100">
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => onUpdateQuantity(selectedProduct.productId, selectedProduct.quantity - 1)}
                        disabled={selectedProduct.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span className="btn btn-outline-secondary disabled fw-bold">
                        Qty: {selectedProduct.quantity}
                      </span>
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => onUpdateQuantity(selectedProduct.productId, selectedProduct.quantity + 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-danger"
                onClick={() => {
                  onRemoveItem(selectedProduct.productId);
                  closeProductModal();
                }}
              >
                <FaTrash className="me-2" />
                Remove from Cart
              </button>
              <button 
                className="btn btn-primary"
                onClick={closeProductModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Simple inline view
  if (showSimpleView) {
    return (
      <>
        <div className="card">
          <div className="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FaList className="me-2" />
              Cart Items ({cart.length})
            </h5>
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={() => setShowSimpleView(false)}
            >
              <FaCreditCard className="me-1" />
              Order Details
            </button>
          </div>
          <div className="card-body">
            {cart.map((item) => (
              <div key={item.productId} className="d-flex align-items-center mb-3 p-3 border rounded">
                <img 
                  src={item.image} 
                  alt={item.name}
                  style={{ width: "80px", height: "80px", objectFit: "contain" }}
                  className="me-3 cursor-pointer"
                  onClick={() => handleViewProduct(item)}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80";
                  }}
                />
                <div className="flex-grow-1">
                  <p 
                    className="mb-1 fw-semibold cursor-pointer hover-text"
                    onClick={() => handleViewProduct(item)}
                  >
                    {item.name}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span className="mx-3 fw-bold">{item.quantity}</span>
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <div>
                      <span className="fw-bold me-3">
                        ₹ {(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}
                      </span>
                      <button 
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => handleViewProduct(item)}
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => onRemoveItem(item.productId)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center mt-4">
              <h4 className="mb-3">Total: ₹ {calculateCartSubtotal()}</h4>
              <button 
                className="btn btn-success btn-lg px-5 me-3"
                onClick={onNavigateToCheckout}
              >
                Proceed to Checkout
              </button>
              <button 
                className="btn btn-outline-primary"
                onClick={onContinueShopping}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>

        {showProductModal && <ProductDetailModal />}
      </>
    );
  }

  // Main Order Details View
  return (
    <>
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaCreditCard className="me-2" />
                Order Details ({cart.length} items)
              </h5>
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => setShowSimpleView(true)}
              >
                <FaList className="me-1" />
                Simple View
              </button>
            </div>
            <div className="card-body">
              {cart.map((item) => (
                <div key={item.productId} className="d-flex align-items-center mb-3 p-3 border rounded hover-card">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    style={{ width: "80px", height: "80px", objectFit: "contain" }}
                    className="me-3 cursor-pointer"
                    onClick={() => handleViewProduct(item)}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/80";
                    }}
                  />
                  <div className="flex-grow-1">
                    <p 
                      className="mb-1 fw-semibold cursor-pointer hover-text"
                      onClick={() => handleViewProduct(item)}
                    >
                      {item.name}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <small className="text-muted me-3">
                          Qty: {item.quantity} × ₹ {parseFloat(item.price).toFixed(2)}
                        </small>
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus />
                          </button>
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="fw-bold me-3">
                          ₹ {(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}
                        </span>
                        <button 
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => handleViewProduct(item)}
                          title="View Product Details"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => onRemoveItem(item.productId)}
                          title="Remove from Cart"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-light">
              <h5 className="mb-0">
                Order Summary
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹ {calculateCartSubtotal()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax (10%):</span>
                <span>₹ {calculateTax()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>
                  {calculateShipping() === "0.00" ? (
                    <span className="text-success">FREE</span>
                  ) : (
                    `$${calculateShipping()}`
                  )}
                </span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total:</span>
                <span className="text-primary">₹ {calculateFinalTotal()}</span>
              </div>
              
              <div className="mt-4 d-grid gap-2">
                <button 
                  className="btn btn-success btn-lg"
                  onClick={onNavigateToCheckout}
                >
                  Proceed to Checkout
                </button>
                <button 
                  className="btn btn-outline-primary"
                  onClick={onContinueShopping}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showProductModal && <ProductDetailModal />}

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .hover-card:hover {
          background-color: #f8f9fa;
          transform: translateY(-2px);
          transition: all 0.2s ease;
        }
        .hover-text:hover {
          color: #0d6efd;
          text-decoration: underline;
        }
        .modal-content {
          border: none;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
      `}</style>
    </>
  );
};

export default CartDetailsView;