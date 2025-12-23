import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Auth.css';

function Signup({ setAuth }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await api.signup(formData);
      
      if (result.success) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('userId', result.data.userId);
        localStorage.setItem('userName', result.data.name);
        setAuth({ token: result.data.token, userId: result.data.userId, userName: result.data.name });
        navigate('/');
      } else {
        setError(result.message || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-hero">
          <h1 className="auth-hero-title">Join FoodExpress</h1>
          <p className="auth-hero-subtitle">Start ordering from thousands of restaurants</p>
          <div className="auth-hero-features">
            <div className="feature-item">
              <span className="feature-icon">✨</span>
              <span>Quick & Easy Signup</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎁</span>
              <span>Exclusive Offers</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⭐</span>
              <span>Personalized Recommendations</span>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Fill in your details to get started</p>
          </div>
          {error && <div className="error-message">❌ {error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a strong password"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary btn-full">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          <div className="auth-footer">
            <p className="auth-switch">
              Already have an account? <a href="/login">Login here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
