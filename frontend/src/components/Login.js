import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Auth.css';

function Login({ setAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await api.login({ email, password });
      
      if (result.success) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('userId', result.data.userId);
        localStorage.setItem('userName', result.data.name);
        setAuth({ token: result.data.token, userId: result.data.userId, userName: result.data.name });
        navigate('/');
      } else {
        setError(result.message || 'Login failed');
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
          <h1 className="auth-hero-title">Welcome Back!</h1>
          <p className="auth-hero-subtitle">Order delicious food from your favorite restaurants</p>
          <div className="auth-hero-features">
            <div className="feature-item">
              <span className="feature-icon">🍕</span>
              <span>1000+ Restaurants</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Fast Delivery</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💳</span>
              <span>Easy Payment</span>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-header">
            <h2>Login</h2>
            <p>Enter your credentials to continue</p>
          </div>
          {error && <div className="error-message">❌ {error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary btn-full">
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
          <div className="auth-footer">
            <p className="auth-switch">
              New to FoodExpress? <a href="/signup">Create an account</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
