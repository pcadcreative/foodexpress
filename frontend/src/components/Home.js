import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Home.css';

function Home({ auth }) {
  const [cities, setCities] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const citiesData = await api.getCities(auth.token);
      if (citiesData.success) {
        setCities(citiesData.data);
      }

      const restaurantsData = await api.getRestaurants(auth.token);
      if (restaurantsData.success) {
        setRestaurants(restaurantsData.data);
      }

      const recData = await api.getRecommendations(auth.userId);
      if (recData.success && recData.data.length > 0) {
        setRecommendations(recData.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = async (cityId) => {
    setSelectedCity(cityId);
    setLoading(true);
    try {
      const data = await api.getRestaurants(auth.token, cityId);
      if (data.success) {
        setRestaurants(data.data);
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p style={{color: '#686B78', fontSize: '16px'}}>Finding best food for you...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Banner */}
      <div className="home-hero">
        <div className="hero-content">
          <h1>Hungry?</h1>
          <p className="hero-subtitle">Order food from favorite restaurants near you.</p>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="recommendations-section">
          <div className="section-header">
            <h2>✨ Recommended for You</h2>
            <p>Based on your taste & previous orders</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filter-section">
        <div className="filter-header">
          <h2>🍴 Restaurants near you</h2>
        </div>
        <div className="filter-controls">
          <select 
            value={selectedCity} 
            onChange={(e) => handleCityChange(e.target.value)} 
            className="city-select"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                📍 {city.name}
              </option>
            ))}
          </select>
          <div className="filter-tags">
            <button className="filter-tag active">All</button>
            <button className="filter-tag">Fast Delivery</button>
            <button className="filter-tag">Offers</button>
            <button className="filter-tag">Rating 4.0+</button>
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="restaurants-section">
        {restaurants.length === 0 ? (
          <div className="no-data">
            <div className="empty-state">
              <span style={{fontSize: '60px'}}>🍽️</span>
              <h3>No restaurants found</h3>
              <p>Try selecting a different city</p>
            </div>
          </div>
        ) : (
          <div className="restaurants-grid">
            {restaurants.map((restaurant) => (
              <div 
                key={restaurant._id} 
                className="restaurant-card" 
                onClick={() => handleRestaurantClick(restaurant._id)}
              >
                <div className="restaurant-image-container">
                  <div className="restaurant-image">
                    <div className="restaurant-placeholder">🍽️</div>
                  </div>
                  {restaurant.rating >= 4.0 && (
                    <div className="restaurant-badge">Top Rated</div>
                  )}
                </div>
                <div className="restaurant-info">
                  <h3>{restaurant.name}</h3>
                  <p className="restaurant-cuisine">{restaurant.cuisine.join(', ')}</p>
                  <div className="restaurant-meta">
                    <div className="rating-badge">
                      <span className="rating-star">⭐</span>
                      <span className="rating-value">{restaurant.rating}</span>
                    </div>
                    <span className="dot">•</span>
                    <span className="delivery-time">{restaurant.deliveryTime} mins</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
