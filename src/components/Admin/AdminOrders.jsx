// src/components/AdminOrders.jsx
import React, { useState, useEffect } from "react";
import { FaEye, FaTrash, FaSearch, FaFilter, FaRedo } from "react-icons/fa";

export default function AdminOrders({ orders: propOrders, onRefresh }) {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (propOrders && propOrders.length > 0) {
      setOrders(propOrders);
      setFilteredOrders(propOrders);
    } else {
      setOrders([]);
      setFilteredOrders([]);
    }
  }, [propOrders]);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, orders]);

  const filterOrders = () => {
    let filtered = orders;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userDisplayName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
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

  const deleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      // Remove from localStorage
      const allOrders = JSON.parse(localStorage.getItem('all_orders')) || [];
      const updatedOrders = allOrders.filter(order => order.id !== orderId && order.orderNumber !== orderId);
      localStorage.setItem('all_orders', JSON.stringify(updatedOrders));
      
      // Remove from user orders
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('user_orders_')) {
          try {
            const userOrders = JSON.parse(localStorage.getItem(key)) || [];
            const updatedUserOrders = userOrders.filter(order => order.id !== orderId && order.orderNumber !== orderId);
            localStorage.setItem(key, JSON.stringify(updatedUserOrders));
          } catch (e) {
            console.error('Error updating user orders:', e);
          }
        }
      });

      // Update local state
      const updatedLocalOrders = orders.filter(order => order.id !== orderId && order.orderNumber !== orderId);
      setOrders(updatedLocalOrders);
      
      alert("Order deleted successfully!");
      
      // Trigger refresh in parent
      if (onRefresh) {
        onRefresh();
      }
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    // Update in localStorage
    const allOrders = JSON.parse(localStorage.getItem('all_orders')) || [];
    const updatedAllOrders = allOrders.map(order =>
      (order.id === orderId || order.orderNumber === orderId) ? { ...order, status: newStatus } : order
    );
    localStorage.setItem('all_orders', JSON.stringify(updatedAllOrders));
    
    // Update in user orders
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('user_orders_')) {
        try {
          const userOrders = JSON.parse(localStorage.getItem(key)) || [];
          const updatedUserOrders = userOrders.map(order =>
            (order.id === orderId || order.orderNumber === orderId) ? { ...order, status: newStatus } : order
          );
          localStorage.setItem(key, JSON.stringify(updatedUserOrders));
        } catch (e) {
          console.error('Error updating user orders:', e);
        }
      }
    });

    // Update local state
    const updatedLocalOrders = orders.map(order =>
      (order.id === orderId || order.orderNumber === orderId) ? { ...order, status: newStatus } : order
    );
    setOrders(updatedLocalOrders);
    
    alert(`Order status updated to ${newStatus}`);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="card-title mb-0">Order Management</h5>
          <div className="d-flex gap-2">
            <div className="input-group" style={{ width: "300px" }}>
              <span className="input-group-text">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="form-select"
              style={{ width: "150px" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {onRefresh && (
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={onRefresh}
                title="Refresh Orders"
              >
                <FaRedo />
              </button>
            )}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-5">
            <FaFilter size={48} className="text-muted mb-3" />
            <h5>No orders found</h5>
            <p className="text-muted">
              {orders.length === 0 
                ? "No orders have been placed yet." 
                : "No orders match your search criteria."}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.orderNumber || order.id}>
                    <td>
                      <strong>{order.orderNumber || order.id}</strong>
                    </td>
                    <td>
                      <div>
                        <div>{order.userName || order.userDisplayName || 'N/A'}</div>
                        <small className="text-muted">{order.userEmail}</small>
                      </div>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {order.items?.length || 0} item(s)
                    </td>
                    <td>
                      <strong>${order.total}</strong>
                    </td>
                    <td>
                      <select
                        className={`form-select form-select-sm ${getStatusBadge(order.status)}`}
                        value={order.status || 'processing'}
                        onChange={(e) => updateOrderStatus(order.orderNumber || order.id, e.target.value)}
                        style={{ border: 'none', background: 'transparent', fontWeight: 'bold' }}
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          title="View Details"
                          onClick={() => {
                            const details = `
Order Details:
- Order: ${order.orderNumber}
- Customer: ${order.userName || order.userDisplayName}
- Email: ${order.userEmail}
- Total: $${order.total}
- Status: ${order.status}
- Date: ${new Date(order.createdAt).toLocaleString()}
- Items: ${order.items?.length || 0}
- Payment: ${order.paymentMethod}
                            `;
                            alert(details);
                          }}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          title="Delete Order"
                          onClick={() => deleteOrder(order.orderNumber || order.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-3">
          <small className="text-muted">
            Showing {filteredOrders.length} of {orders.length} orders
          </small>
        </div>
      </div>
    </div>
  );
}