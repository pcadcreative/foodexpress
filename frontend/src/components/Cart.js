import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Cart.css';

function Cart({ auth }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [ordering, setOrdering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await api.getCart(auth.token);
      if (data.success) {
        setCart(data.data);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (foodItemId, newQuantity) => {
    try {
      const result = await api.updateCart(auth.token, { foodItemId, quantity: newQuantity });
      if (result.success) {
        setCart(result.data);
      }
    } catch (error) {
      alert('Error updating cart');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Clear all items from cart?')) {
      try {
        await api.clearCart(auth.token);
        loadCart();
      } catch (error) {
        alert('Error clearing cart');
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.state || !address.zipCode) {
      alert('Please fill in all address fields');
      return;
    }

    setOrdering(true);
    try {
      const result = await api.placeOrder(auth.token, {
        deliveryAddress: address,
        idempotencyKey: `order-${Date.now()}-${Math.random()}`,
      });

      if (result.success) {
        alert('Order placed successfully!');
        navigate('/orders');
      } else {
        alert(result.message || 'Failed to place order');
      }
    } catch (error) {
      alert('Error placing order');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="btn-primary">
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      <div className="cart-content">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item.foodItemId} className="cart-item">
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-price">₹{item.price} each</p>
              </div>
              <div className="cart-item-actions">
                <button onClick={() => handleQuantityChange(item.foodItemId, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.foodItemId, item.quantity + 1)}>+</button>
                <button onClick={() => handleQuantityChange(item.foodItemId, 0)} className="btn-remove">Remove</button>
              </div>
            </div>
          ))}

          <div className="cart-total">
            <h2>Total: ₹{cart.totalAmount}</h2>
            <button onClick={handleClearCart} className="btn-clear">Clear Cart</button>
          </div>
        </div>

        <div className="checkout-section">
          <h2>Delivery Address</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Street Address"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="State"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="ZIP Code"
              value={address.zipCode}
              onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
            />
          </div>
          <button onClick={handlePlaceOrder} disabled={ordering} className="btn-primary">
            {ordering ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
