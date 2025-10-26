import React from "react";
import { FaBox, FaCreditCard, FaMapMarkerAlt, FaShoppingBag, FaTag } from "react-icons/fa";

const getStatusIcon = (status) => {
  switch (status) {
    case 'processing': return <span className="text-warning">⏳</span>;
    case 'shipped': return <span className="text-info">🚚</span>;
    case 'delivered': return <span className="text-success">✅</span>;
    default: return <FaBox className="text-secondary" />;
  }
};

const getStatusBadge = (status) => {
  const statusColors = {
    processing: 'warning',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'danger'
  };
  return `badge bg-${statusColors[status] || 'secondary'}`;
};

const OrderCard = ({ order }) => {
  const isSingleProduct = order.items && order.items.length === 1;
  const singleProduct = isSingleProduct ? order.items[0] : null;

  return (
    <div className="col-12 mb-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-0">
              {getStatusIcon(order.status)} 
              Order #: {order.orderNumber}
            </h6>
            <small className="text-muted">
              {new Date(order.createdAt).toLocaleString()}
            </small>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className={getStatusBadge(order.status)}>
              {order.status?.toUpperCase() || 'PROCESSING'}
            </span>
            <span className="fw-bold text-primary fs-5">₹ {parseFloat(order.total).toFixed(2)}</span>
          </div>
        </div>
        
        <div className="card-body p-0">
          {/* Single Product Order Summary */}
          {isSingleProduct && (
            <div className="p-4 border-bottom">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex align-items-start">
                    <img 
                      src={singleProduct.image} 
                      alt={singleProduct.name}
                      style={{ 
                        width: "120px", 
                        height: "120px", 
                        objectFit: "contain" 
                      }}
                      className="me-4 rounded border"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/120";
                      }}
                    />
                    <div className="flex-grow-1">
                      <h5 className="fw-bold text-dark mb-2">{singleProduct.name}</h5>
                      <div className="d-flex align-items-center mb-3">
                        <FaTag className="text-muted me-2" />
                        <span className="text-primary fw-semibold fs-5">
                          ₹ {parseFloat(singleProduct.price).toFixed(2)}
                        </span>
                      </div>
                      <div className="d-flex gap-4 text-muted">
                        <div>
                          <small className="fw-semibold">Quantity</small>
                          <div className="fw-bold text-dark">{singleProduct.quantity}</div>
                        </div>
                        <div>
                          <small className="fw-semibold">Item Total</small>
                          <div className="fw-bold text-dark">
                            ₹ {(parseFloat(singleProduct.price) * parseInt(singleProduct.quantity)).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-light p-3 rounded">
                    <h6 className="d-flex align-items-center mb-3">
                      <FaShoppingBag className="me-2 text-primary" />
                      Order Summary
                    </h6>
                    <div className="d-flex justify-content-between mb-2">
                      <small>Item Price:</small>
                      <small>₹ {parseFloat(singleProduct.price).toFixed(2)}</small>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <small>Quantity:</small>
                      <small>{singleProduct.quantity}</small>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <small>Subtotal:</small>
                      <small>₹ {parseFloat(order.subtotal).toFixed(2)}</small>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <small>Tax:</small>
                      <small>₹ {parseFloat(order.tax).toFixed(2)}</small>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <small>Shipping:</small>
                      <small className={order.shipping === "0.00" ? "text-success" : ""}>
                        {order.shipping === "0.00" ? "FREE" : `₹ ${parseFloat(order.shipping).toFixed(2)}`}
                      </small>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total:</span>
                      <span className="text-primary">₹ {parseFloat(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Multiple Products View */}
          {!isSingleProduct && (
            <div className="p-4 border-bottom">
              <h6 className="d-flex align-items-center mb-3">
                <FaBox className="me-2" />
                Ordered Products ({order.items?.length || 0})
              </h6>
              <div className="row">
                {order.items && order.items.map((item, index) => (
                  <div key={index} className="col-md-6 mb-3">
                    <div className="d-flex align-items-center p-3 border rounded">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={{ width: "60px", height: "60px", objectFit: "contain" }}
                        className="me-3"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/60";
                        }}
                      />
                      <div className="flex-grow-1">
                        <p className="mb-1 fw-semibold small">{item.name}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            Qty: {item.quantity} × ₹ {parseFloat(item.price).toFixed(2)}
                          </small>
                          <small className="fw-bold">
                            ₹ {(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Details - Common for both views */}
          <div className="p-4">
            <div className="row">
              <div className="col-md-8">
                {/* Order Summary for multiple products */}
                {!isSingleProduct && (
                  <div className="mb-4">
                    <h6><FaCreditCard className="me-2" />Order Summary</h6>
                    <div className="row">
                      <div className="col-6">
                        <small className="text-muted">Subtotal:</small>
                        <div className="fw-semibold">₹ {parseFloat(order.subtotal).toFixed(2)}</div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Tax:</small>
                        <div className="fw-semibold">₹ {parseFloat(order.tax).toFixed(2)}</div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Shipping:</small>
                        <div className="fw-semibold">
                          {order.shipping === "0.00" ? (
                            <span className="text-success">FREE</span>
                          ) : (
                            `$${parseFloat(order.shipping).toFixed(2)}`
                          )}
                        </div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Total:</small>
                        <div className="fw-bold text-primary fs-5">₹ {parseFloat(order.total).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="mb-4">
                    <h6><FaMapMarkerAlt className="me-2" />Shipping Address</h6>
                    <div className="bg-light p-3 rounded">
                      <p className="mb-1 fw-semibold">{order.shippingAddress.fullName}</p>
                      <p className="mb-1 text-muted">{order.shippingAddress.address}</p>
                      <p className="mb-1 text-muted">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                      <p className="mb-0 text-muted">{order.shippingAddress.country}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="col-md-4">
                {/* Payment Method */}
                <div className="mb-4">
                  <h6><FaCreditCard className="me-2" />Payment Method</h6>
                  <div className="bg-light p-3 rounded">
                    <div className="fw-semibold text-uppercase">
                      {order.paymentMethod || 'Credit Card'}
                    </div>
                    <small className="text-muted">Payment completed</small>
                  </div>
                </div>

                {/* Order Timeline */}
                <div>
                  <h6 className="mb-3">Order Status</h6>
                  <div className="timeline">
                    <div className={`timeline-item ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'active' : ''}`}>
                      <div className="timeline-marker bg-success"></div>
                      <div className="timeline-content">
                        <small className="fw-semibold">Order Placed</small>
                        <small className="text-muted d-block">{new Date(order.createdAt).toLocaleDateString()}</small>
                      </div>
                    </div>
                    <div className={`timeline-item ${order.status === 'shipped' || order.status === 'delivered' ? 'active' : ''}`}>
                      <div className="timeline-marker bg-info"></div>
                      <div className="timeline-content">
                        <small className="fw-semibold">Shipped</small>
                        <small className="text-muted d-block">
                          {order.status === 'shipped' || order.status === 'delivered' ? 'In transit' : 'Pending'}
                        </small>
                      </div>
                    </div>
                    <div className={`timeline-item ${order.status === 'delivered' ? 'active' : ''}`}>
                      <div className="timeline-marker bg-primary"></div>
                      <div className="timeline-content">
                        <small className="fw-semibold">Delivered</small>
                        <small className="text-muted d-block">
                          {order.status === 'delivered' ? 'Delivered' : 'Expected soon'}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .timeline {
          position: relative;
          padding-left: 20px;
        }
        .timeline-item {
          position: relative;
          padding-bottom: 20px;
        }
        .timeline-item:last-child {
          padding-bottom: 0;
        }
        .timeline-marker {
          position: absolute;
          left: -20px;
          top: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #dee2e6;
        }
        .timeline-item.active .timeline-marker {
          background: currentColor;
        }
        .timeline-content {
          margin-left: 0;
        }
      `}</style>
    </div>
  );
};

export default OrderCard;