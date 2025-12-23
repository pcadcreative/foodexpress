import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ auth, setAuth }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setAuth(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/')}>
          <span className="brand-icon">🍔</span>
          <span className="brand-name">FoodExpress</span>
        </div>
        {auth && (
          <div className="navbar-menu">
            <button onClick={() => navigate('/')} className="navbar-link">
              <span className="link-icon">🏠</span>
              <span>Home</span>
            </button>
            <button onClick={() => navigate('/orders')} className="navbar-link">
              <span className="link-icon">📦</span>
              <span>Orders</span>
            </button>
            <button onClick={() => navigate('/cart')} className="navbar-link cart-btn">
              <span className="link-icon">🛒</span>
              <span>Cart</span>
            </button>
            <div className="navbar-divider"></div>
            <span className="navbar-user">
              <span className="user-icon">👤</span>
              {auth.userName}
            </span>
            <button onClick={handleLogout} className="navbar-logout">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
