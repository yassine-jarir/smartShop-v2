import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import './ClientDashboard.css';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, productsData] = await Promise.all([
        api.get('/client/profile'),
        api.get('/client/products', { params: { page: 0, size: 12 } }),
      ]);
      setProfile(profileData.data);
      setProducts(productsData.data.content || []);
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="client-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>🛒 Bienvenue, {profile?.nom || user?.username}!</h1>
          <p className="subtitle">Découvrez nos produits et passez vos commandes</p>
        </div>
        <div className="profile-card">
          <div className="profile-info">
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{profile?.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Niveau:</span>
              <span className={`badge badge-${profile?.niveauFidelite?.toLowerCase()}`}>
                {profile?.niveauFidelite || 'BASIC'}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Commandes:</span>
              <span className="value">{profile?.totalOrders || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      <div className="dashboard-section">
        <div className="section-header">
          <h2>📦 Produits Disponibles</h2>
          <button onClick={() => navigate('/client/products')} className="btn-view-all">
            Voir tout →
          </button>
        </div>

        {products.length > 0 ? (
          <div className="products-grid">
            {products.slice(0, 8).map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-header">
                  <h3>{product.nom}</h3>
                  {product.isDeleted && <span className="badge-deleted">Indisponible</span>}
                </div>
                <div className="product-details">
                  <div className="price">{product.prixUnitaire} DH</div>
                  <div className="stock">
                    Stock: <strong>{product.stockDisponible}</strong>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/client/products/${product.id}`)}
                  className="btn-details"
                  disabled={product.isDeleted || product.stockDisponible === 0}
                >
                  {product.stockDisponible > 0 ? 'Voir détails' : 'Rupture de stock'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">Aucun produit disponible pour le moment</p>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
