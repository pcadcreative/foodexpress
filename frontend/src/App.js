import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Restaurant from './components/Restaurant';
import Cart from './components/Cart';
import Orders from './components/Orders';
import './App.css';

function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    
    if (token && userId && userName) {
      setAuth({ token, userId, userName });
    }
  }, []);

  return (
    <Router>
      <div className="App">
        {auth && <Navbar auth={auth} setAuth={setAuth} />}
        
        <Routes>
          <Route path="/login" element={!auth ? <Login setAuth={setAuth} /> : <Navigate to="/" />} />
          <Route path="/signup" element={!auth ? <Signup setAuth={setAuth} /> : <Navigate to="/" />} />
          
          <Route path="/" element={auth ? <Home auth={auth} /> : <Navigate to="/login" />} />
          <Route path="/restaurant/:id" element={auth ? <Restaurant auth={auth} /> : <Navigate to="/login" />} />
          <Route path="/cart" element={auth ? <Cart auth={auth} /> : <Navigate to="/login" />} />
          <Route path="/orders" element={auth ? <Orders auth={auth} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
