import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebaseConfig";
import { getCart, clearCart, saveOrder } from "../../utils/orderStorage";
import { 
  FaSpinner, 
  FaCheck, 
  FaExclamationTriangle, 
  FaShoppingBag, 
  FaArrowLeft,
  FaCreditCard,
  FaPaypal,
  FaUniversity,
  FaMoneyBillWave,
  FaLock
} from "react-icons/fa";

const Checkout = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [activePaymentTab, setActivePaymentTab] = useState('credit-card');
  const [formData, setFormData] = useState({
    // Shipping Information
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    
    // Credit Card Information
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    
    // PayPal (just email for demo)
    paypalEmail: "",
    
    // Bank Transfer
    accountName: "",
    accountNumber: "",
    routingNumber: "",
  });

  const user = auth.currentUser;
  const isSingleProduct = productId && productId !== "cart";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isSingleProduct) {
      fetchProduct();
    } else {
      loadCartItems();
    }
  }, [productId, user, navigate]);

  const fetchProduct = async () => {
    try {
      // Try to fetch from both API and admin products
      const [apiProducts, adminProducts] = await Promise.all([
        fetch("https://fakestoreapi.com/products").then(res => res.json()),
        Promise.resolve(JSON.parse(localStorage.getItem('adminProducts')) || [])
      ]);
      
      // Check both sources
      let foundProduct = apiProducts.find(p => p.id === parseInt(productId));
      if (!foundProduct) {
        foundProduct = adminProducts.find(p => p.id.toString() === productId);
      }
      
      setProduct(foundProduct);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const loadCartItems = () => {
    if (user) {
      const cart = getCart(user.uid);
      setCartItems(cart);
    }
  };

  const calculateSubtotal = () => {
    if (product) {
      return (product.price * quantity).toFixed(2);
    }
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const calculateTax = () => {
    const subtotal = parseFloat(calculateSubtotal());
    return (subtotal * 0.1).toFixed(2);
  };

  const calculateShipping = () => {
    const subtotal = parseFloat(calculateSubtotal());
    return subtotal > 50 ? "0.00" : "5.99";
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const tax = parseFloat(calculateTax());
    const shipping = parseFloat(calculateShipping());
    return (subtotal + tax + shipping).toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return value;
  };

  const validateForm = () => {
    // Basic shipping validation
    const requiredShippingFields = ['fullName', 'email', 'address', 'city', 'state', 'zipCode', 'country'];
    const missingShippingFields = requiredShippingFields.filter(field => !formData[field]);
    
    if (missingShippingFields.length > 0) {
      throw new Error(`Please fill in all required shipping fields: ${missingShippingFields.join(', ')}`);
    }

    // Payment method specific validation
    switch (activePaymentTab) {
      case 'credit-card':
        if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
          throw new Error('Please fill in all credit card details');
        }
        if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
          throw new Error('Please enter a valid 16-digit card number');
        }
        break;
      
      case 'paypal':
        if (!formData.paypalEmail) {
          throw new Error('Please enter your PayPal email');
        }
        if (!/\S+@\S+\.\S+/.test(formData.paypalEmail)) {
          throw new Error('Please enter a valid email address for PayPal');
        }
        break;
      
      case 'bank-transfer':
        if (!formData.accountName || !formData.accountNumber || !formData.routingNumber) {
          throw new Error('Please fill in all bank transfer details');
        }
        break;
      
      case 'cash-on-delivery':
        // No additional validation needed
        break;
      
      default:
        throw new Error('Please select a payment method');
    }
  };

  const handleSubmitOrder = async (e) => {
    if (e) e.preventDefault();
    
    setOrderProcessing(true);

    try {
      validateForm();

      // Create order object
      const orderData = {
        userId: user.uid,
        orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        items: product ? [
          {
            productId: product.id,
            name: product.title,
            price: product.price,
            quantity: quantity,
            image: product.image
          }
        ] : cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal: parseFloat(calculateSubtotal()),
        tax: parseFloat(calculateTax()),
        shipping: parseFloat(calculateShipping()),
        total: parseFloat(calculateTotal()),
        status: 'processing',
        createdAt: new Date().toISOString(),
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: activePaymentTab,
        paymentStatus: 'completed'
      };

      console.log('📦 Saving order:', orderData);

      // Save order
      const success = saveOrder(orderData);

      if (success) {
        console.log("✅ Order saved successfully!");

        // Clear cart if it was a cart checkout
        if (!product) {
          clearCart(user.uid);
        }

        // Show success message
        alert(`Order placed successfully! Order #: ${orderData.orderNumber}`);

        // Navigate to dashboard
        navigate('/dashboard?tab=orders');

      } else {
        throw new Error('Failed to save order to storage');
      }

    } catch (error) {
      console.error('❌ Error placing order:', error);
      alert(`Failed to place order: ${error.message}`);
    } finally {
      setOrderProcessing(false);
    }
  };

  const PaymentMethods = {
    'credit-card': { name: 'Credit Card', icon: FaCreditCard, color: 'primary' },
    'paypal': { name: 'PayPal', icon: FaPaypal, color: 'info' },
    'bank-transfer': { name: 'Bank Transfer', icon: FaUniversity, color: 'success' },
    'cash-on-delivery': { name: 'Cash on Delivery', icon: FaMoneyBillWave, color: 'warning' }
  };

  if (!user) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Please log in to proceed with checkout.</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button 
            className="btn btn-outline-secondary btn-sm mb-2"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="me-1" />
            Back
          </button>
          <h2 className="mb-0">
            {isSingleProduct ? "Single Product Checkout" : "Cart Checkout"}
          </h2>
        </div>
        <div className="text-end">
          <span className="badge bg-primary fs-6">
            {isSingleProduct ? "1 Product" : `${cartItems.length} Items`}
          </span>
        </div>
      </div>

      <div className="row">
        {/* Shipping and Payment Information */}
        <div className="col-md-8">
          {/* Shipping Information */}
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <FaShoppingBag className="me-2" />
                Shipping Information
              </h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="fullName" className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="address" className="form-label">Address *</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="city" className="form-label">City *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="state" className="form-label">State *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="zipCode" className="form-label">ZIP Code *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="country" className="form-label">Country *</label>
                <input
                  type="text"
                  className="form-control"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card">
            <div className="card-header bg-success text-white">
              <h4 className="mb-0">
                <FaLock className="me-2" />
                Payment Method
              </h4>
            </div>
            <div className="card-body">
              {/* Payment Method Tabs */}
              <ul className="nav nav-pills mb-4" role="tablist">
                {Object.entries(PaymentMethods).map(([key, { name, icon: Icon, color }]) => (
                  <li key={key} className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activePaymentTab === key ? 'active' : ''}`}
                      onClick={() => setActivePaymentTab(key)}
                      type="button"
                    >
                      <Icon className="me-2" />
                      {name}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Payment Forms */}
              <div className="tab-content">
                {/* Credit Card */}
                {activePaymentTab === 'credit-card' && (
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label htmlFor="cardNumber" className="form-label">Card Number *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          cardNumber: formatCardNumber(e.target.value)
                        }))}
                        maxLength={19}
                        required
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label htmlFor="cardName" className="form-label">Name on Card *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="cardName"
                        name="cardName"
                        placeholder="John Doe"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="expiryDate" className="form-label">Expiry Date *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          expiryDate: formatExpiryDate(e.target.value)
                        }))}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="cvv" className="form-label">CVV *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* PayPal */}
                {activePaymentTab === 'paypal' && (
                  <div className="text-center">
                    <FaPaypal size={48} className="text-primary mb-3" />
                    <div className="mb-3">
                      <label htmlFor="paypalEmail" className="form-label">PayPal Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        id="paypalEmail"
                        name="paypalEmail"
                        placeholder="your-email@example.com"
                        value={formData.paypalEmail}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <p className="text-muted">
                      You will be redirected to PayPal to complete your payment.
                    </p>
                  </div>
                )}

                {/* Bank Transfer */}
                {activePaymentTab === 'bank-transfer' && (
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label htmlFor="accountName" className="form-label">Account Holder Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="accountName"
                        name="accountName"
                        value={formData.accountName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="accountNumber" className="form-label">Account Number *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="accountNumber"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="routingNumber" className="form-label">Routing Number *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="routingNumber"
                        name="routingNumber"
                        value={formData.routingNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Cash on Delivery */}
                {activePaymentTab === 'cash-on-delivery' && (
                  <div className="text-center">
                    <FaMoneyBillWave size={48} className="text-warning mb-3" />
                    <h5>Cash on Delivery</h5>
                    <p className="text-muted">
                      Pay with cash when your order is delivered. 
                      An additional ₹ 2.00 processing fee will be added.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-success btn-lg w-100 py-3 fw-bold mt-4"
                onClick={handleSubmitOrder}
                disabled={orderProcessing || (product && !product) || (!product && cartItems.length === 0)}
              >
                {orderProcessing ? (
                  <>
                    <FaSpinner className="me-2 fa-spin" />
                    Processing Your Order...
                  </>
                ) : (
                  `Place Order - ₹ ${calculateTotal()}`
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-md-4">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-light">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              {/* Single Product Order Summary */}
              {isSingleProduct && product && (
                <div className="mb-4">
                  <h6 className="text-muted mb-3">Product Details</h6>
                  <div className="d-flex align-items-start mb-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{ 
                        width: "80px", 
                        height: "80px", 
                        objectFit: "contain" 
                      }}
                      className="me-3 rounded border"
                    />
                    <div className="flex-grow-1">
                      <h6 className="fw-semibold mb-1">{product.title}</h6>
                      <p className="text-muted small mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <span className="fw-bold text-primary me-2">
                            ₹ {product.price}
                          </span>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-outline-secondary"
                              onClick={() => handleQuantityChange(quantity - 1)}
                              disabled={quantity <= 1}
                            >
                              -
                            </button>
                            <span className="btn btn-outline-secondary disabled">
                              {quantity}
                            </span>
                            <button 
                              className="btn btn-outline-secondary"
                              onClick={() => handleQuantityChange(quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <span className="fw-bold">
                          ₹ {(product.price * quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cart Items Summary */}
              {!isSingleProduct && cartItems.length > 0 && (
                <div className="mb-4">
                  <h6 className="text-muted mb-3">Cart Items ({cartItems.length})</h6>
                  {cartItems.map(item => (
                    <div key={item.productId} className="d-flex align-items-center mb-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ 
                          width: "40px", 
                          height: "40px", 
                          objectFit: "contain" 
                        }}
                        className="me-2 rounded border"
                      />
                      <div className="flex-grow-1">
                        <small className="fw-semibold d-block">{item.name}</small>
                        <small className="text-muted">
                          Qty: {item.quantity} × ₹ {item.price}
                        </small>
                      </div>
                      <small className="fw-bold">
                        ₹ {(item.price * item.quantity).toFixed(2)}
                      </small>
                    </div>
                  ))}
                </div>
              )}

              {/* Order Breakdown */}
              <div className="border-top pt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹ {calculateSubtotal()}</span>
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
                      `₹ ${calculateShipping()}`
                    )}
                  </span>
                </div>
                {activePaymentTab === 'cash-on-delivery' && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>COD Fee:</span>
                    <span>₹ 2.00</span>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total:</span>
                  <span className="text-primary">
                    ₹ {activePaymentTab === 'cash-on-delivery' 
                      ? (parseFloat(calculateTotal()) + 2).toFixed(2) 
                      : calculateTotal()
                    }
                  </span>
                </div>

                {/* Selected Payment Method */}
                <div className="mt-3 p-3 bg-light rounded">
                  <small className="text-muted d-block">Payment Method:</small>
                  <div className="d-flex align-items-center">
                    {(() => {
                      const { icon: Icon, name, color } = PaymentMethods[activePaymentTab];
                      return (
                        <>
                          <Icon className={`text-${color} me-2`} />
                          <span className="fw-semibold">{name}</span>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Security Features */}
                <div className="mt-4">
                  <div className="d-flex align-items-center text-success small mb-2">
                    <FaLock className="me-2" />
                    <span>Secure encrypted payment</span>
                  </div>
                  <div className="d-flex align-items-center text-success small mb-2">
                    <FaCheck className="me-2" />
                    <span>Free returns within 30 days</span>
                  </div>
                  <div className="d-flex align-items-center text-success small">
                    <FaCheck className="me-2" />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .sticky-top {
          position: sticky;
          z-index: 100;
        }
        .nav-pills .nav-link {
          color: #495057;
          border: 1px solid #dee2e6;
          margin-right: 5px;
          margin-bottom: 5px;
        }
        .nav-pills .nav-link.active {
          background-color: #0d6efd;
          border-color: #0d6efd;
        }
      `}</style>
    </div>
  );
};

export default Checkout;