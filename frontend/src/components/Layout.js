import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>🛒 SmartShop</h1>
        </div>
        <div className="navbar-menu">
          {user?.role === 'ADMIN' ? (
            <>
              <Link to="/products" className={isActive('/products')}>
                📦 Produits
              </Link>
              <Link to="/clients" className={isActive('/clients')}>
                👥 Clients
              </Link>
              <Link to="/orders" className={isActive('/orders')}>
                📋 Commandes
              </Link>
              <Link to="/promos" className={isActive('/promos')}>
                🎟️ Promos
              </Link>
              <Link to="/users" className={isActive('/users')}>
                👤 Utilisateurs
              </Link>
            </>
          ) : (
            <>
              <Link to="/client/dashboard" className={isActive('/client/dashboard')}>
                🏠 Accueil
              </Link>
              <Link to="/client/products" className={isActive('/client/products')}>
                📦 Produits
              </Link>
            </>
          )}
        </div>
        <div className="navbar-user">
          {user && (
            <>
              <span className="user-name">👤 {user.username}</span>
              <span className="user-role">{user.role === 'ADMIN' ? 'Admin' : 'Client'}</span>
              <button onClick={handleLogout} className="btn-logout">
                Déconnexion
              </button>
            </>
          )}
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
