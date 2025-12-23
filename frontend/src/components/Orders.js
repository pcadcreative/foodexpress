import React, { useState, useEffect } from 'react';
import api from '../api';
import './Orders.css';

function Orders({ auth }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await api.getOrders(auth.token);
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#f59e0b',
      CONFIRMED: '#3b82f6',
      PREPARING: '#8b5cf6',
      OUT_FOR_DELIVERY: '#06b6d4',
      DELIVERED: '#10b981',
      CANCELLED: '#ef4444',
    };
    return colors[status] || '#888';
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <h2>No orders yet</h2>
        <p>Start ordering to see your order history</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>Your Orders</h1>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <h3>Order #{order._id.slice(-6)}</h3>
                <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="order-status" style={{ color: getStatusColor(order.status) }}>
                {order.status}
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-address">
                <strong>Delivery Address:</strong>
                <p>{order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
              </div>
              <div className="order-total">
                <strong>Total: ₹{order.totalAmount}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
