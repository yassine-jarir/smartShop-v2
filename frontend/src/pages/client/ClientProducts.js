import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import './ClientProducts.css';

const ClientProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/client/products', {
        params: { page, size: 12 },
      });
      setProducts(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      setError('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="client-products-page">
      <div className="page-header">
        <div>
          <button onClick={() => navigate('/client/dashboard')} className="btn-back">
            ← Retour
          </button>
          <h1>📦 Catalogue Produits</h1>
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {products.length > 0 ? (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-placeholder">
                  📦
                </div>
                <div className="product-info">
                  <h3>{product.nom}</h3>
                  <div className="product-price">{product.prixUnitaire} DH</div>
                  <div className="product-stock">
                    {product.stockDisponible > 0 ? (
                      <span className="in-stock">✓ En stock ({product.stockDisponible})</span>
                    ) : (
                      <span className="out-of-stock">✗ Rupture de stock</span>
                    )}
                  </div>
                  {product.isDeleted && (
                    <div className="product-deleted">Produit indisponible</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn-page"
              >
                ← Précédent
              </button>
              <span className="page-info">
                Page {page + 1} sur {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="btn-page"
              >
                Suivant →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="no-products">
          <p>Aucun produit disponible pour le moment</p>
        </div>
      )}
    </div>
  );
};

export default ClientProducts;
