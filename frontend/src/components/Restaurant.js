import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import './Restaurant.css';

function Restaurant({ auth }) {
  const { id } = useParams();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadMenu();
  }, [id]);

  const loadMenu = async () => {
    try {
      const data = await api.getMenu(auth.token, id);
      if (data.success) {
        setMenu(data.data);
      }
    } catch (error) {
      console.error('Error loading menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (foodItemId) => {
    setAddingToCart(foodItemId);
    try {
      const result = await api.addToCart(auth.token, { foodItemId, quantity: 1 });
      if (result.success) {
        alert('Added to cart!');
      } else {
        alert(result.message || 'Failed to add to cart');
      }
    } catch (error) {
      alert('Error adding to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading menu...</div>;
  }

  return (
    <div className="restaurant-container">
      <div className="restaurant-header">
        <button onClick={() => navigate(-1)} className="back-button">← Back</button>
        <h1>Menu</h1>
      </div>

      <div className="menu-grid">
        {menu.length === 0 ? (
          <p className="no-data">No menu items available</p>
        ) : (
          menu.map((item) => (
            <div key={item._id} className="menu-item">
              <div className="menu-item-image">
                <div className="menu-item-placeholder">🍕</div>
                {item.isVegetarian && <span className="veg-badge">🌱 Veg</span>}
              </div>
              <div className="menu-item-info">
                <h3>{item.name}</h3>
                <p className="menu-item-description">{item.description}</p>
                <div className="menu-item-footer">
                  <span className="menu-item-price">₹{item.price}</span>
                  <button
                    onClick={() => handleAddToCart(item._id)}
                    disabled={addingToCart === item._id}
                    className="btn-add-to-cart"
                  >
                    {addingToCart === item._id ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Restaurant;
