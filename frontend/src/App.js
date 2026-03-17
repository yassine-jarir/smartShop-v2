import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './state/AuthContext';
import { CartProvider } from './state/CartContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import ProductList from './pages/products/ProductList';
import ProductForm from './pages/products/ProductForm';
import ClientList from './pages/clients/ClientList';
import ClientForm from './pages/clients/ClientForm';
import ClientDetails from './pages/clients/ClientDetails';
import OrderList from './pages/orders/OrderList';
import CreateOrder from './pages/orders/CreateOrder';
import OrderDetails from './pages/orders/OrderDetails';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProducts from './pages/client/ClientProducts';
import PromoList from './pages/promos/PromoList';
import PromoForm from './pages/promos/PromoForm';
import UserList from './pages/users/UserList';
import UserForm from './pages/users/UserForm';
import './App.css';

const PrivateRoute = ({ children, requireAdmin }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  // Check if admin access is required
  if (requireAdmin && user?.role !== 'ADMIN') {
    return <Navigate to="/client/dashboard" />;
  }
  
  // Redirect clients from admin routes
  if (user?.role === 'CLIENT' && !window.location.pathname.startsWith('/client')) {
    return <Navigate to="/client/dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <Layout>
                    <Routes>
                      {/* Default redirect based on role */}
                      <Route path="/" element={<RoleBasedRedirect />} />
                      
                      {/* Admin Routes */}
                      <Route path="/products" element={<PrivateRoute requireAdmin><ProductList /></PrivateRoute>} />
                      <Route path="/products/new" element={<PrivateRoute requireAdmin><ProductForm /></PrivateRoute>} />
                      <Route path="/products/:id/edit" element={<PrivateRoute requireAdmin><ProductForm /></PrivateRoute>} />
                      <Route path="/clients" element={<PrivateRoute requireAdmin><ClientList /></PrivateRoute>} />
                      <Route path="/clients/new" element={<PrivateRoute requireAdmin><ClientForm /></PrivateRoute>} />
                      <Route path="/clients/:id" element={<PrivateRoute requireAdmin><ClientDetails /></PrivateRoute>} />
                      <Route path="/clients/:id/edit" element={<PrivateRoute requireAdmin><ClientForm /></PrivateRoute>} />
                      <Route path="/orders" element={<PrivateRoute requireAdmin><OrderList /></PrivateRoute>} />
                      <Route path="/orders/new" element={<PrivateRoute requireAdmin><CreateOrder /></PrivateRoute>} />
                      <Route path="/orders/:id" element={<PrivateRoute requireAdmin><OrderDetails /></PrivateRoute>} />
                      <Route path="/promos" element={<PrivateRoute requireAdmin><PromoList /></PrivateRoute>} />
                      <Route path="/promos/new" element={<PrivateRoute requireAdmin><PromoForm /></PrivateRoute>} />
                      <Route path="/promos/:id/edit" element={<PrivateRoute requireAdmin><PromoForm /></PrivateRoute>} />
                      <Route path="/users" element={<PrivateRoute requireAdmin><UserList /></PrivateRoute>} />
                      <Route path="/users/new" element={<PrivateRoute requireAdmin><UserForm /></PrivateRoute>} />
                      <Route path="/users/:id/edit" element={<PrivateRoute requireAdmin><UserForm /></PrivateRoute>} />
                      
                      {/* Client Routes */}
                      <Route path="/client/dashboard" element={<ClientDashboard />} />
                      <Route path="/client/products" element={<ClientProducts />} />
                      <Route path="/client/products/:id" element={<ClientProducts />} />
                    </Routes>
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

// Component to redirect based on user role
const RoleBasedRedirect = () => {
  const { user } = useAuth();
  
  if (user?.role === 'ADMIN') {
    return <Navigate to="/products" />;
  }
  return <Navigate to="/client/dashboard" />;
};

export default App;
