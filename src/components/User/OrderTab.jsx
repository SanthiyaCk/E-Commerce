import React from "react";
import OrderCard from "./OrderCard";
import { FaBox, FaFilter } from "react-icons/fa";

const OrdersTab = ({ orders, navigate }) => {
  const singleProductOrders = orders.filter(order => order.items && order.items.length === 1);
  const multiProductOrders = orders.filter(order => order.items && order.items.length > 1);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <FaBox className="me-2" />
          Order History
        </h4>
        <div className="text-muted">
          <small>
            {orders.length} total orders • {singleProductOrders.length} single product • {multiProductOrders.length} multiple products
          </small>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <FaBox size={64} className="text-muted mb-3 opacity-25" />
          <h4 className="text-muted mb-3">No orders yet</h4>
          <p className="text-muted mb-4">Your order history will appear here after you make a purchase</p>
          <button className="btn btn-primary btn-lg px-4" onClick={() => navigate("/products")}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <OrderCard key={order.orderNumber} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;