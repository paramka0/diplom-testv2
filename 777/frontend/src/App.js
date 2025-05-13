import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { NotificationProvider } from './context/NotificationContext';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateOrder from './pages/CreateOrder';
import AdminPanel from './pages/AdminPanel';
import './styles/global.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <Router>
        <div className="app">
          <Header user={user} onLogout={handleLogout} />
          <main className="container">
            <Routes>
              <Route path="/login" element={
                !user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />
              } />
              <Route path="/register" element={
                !user ? <Register onLogin={handleLogin} /> : <Navigate to="/" />
              } />
              <Route path="/create-order" element={
                user ? <CreateOrder /> : <Navigate to="/login" />
              } />
              <Route path="/admin" element={
                user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />
              } />
              <Route path="/" element={
                user ? <Navigate to="/create-order" /> : <Navigate to="/login" />
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App; 