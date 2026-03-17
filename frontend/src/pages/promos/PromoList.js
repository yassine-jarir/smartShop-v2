import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { promoService } from '../../services/promoService';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import './PromoList.css';

const PromoList = () => {
  const navigate = useNavigate();
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPromos();
  }, []);

  const loadPromos = async () => {
    try {
      setLoading(true);
      const data = await promoService.getAll();
      setPromos(data);
    } catch (err) {
      setError('Erreur lors du chargement des codes promo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce code promo ?')) {
      return;
    }

    try {
      await promoService.delete(id);
      setPromos(promos.filter(p => p.id !== id));
      setError('');
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="promo-list-page">
      <div className="page-header">
        <h1>🎟️ Gestion des Codes Promo</h1>
        <button onClick={() => navigate('/promos/new')} className="btn-primary">
          ➕ Nouveau Code Promo
        </button>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      <div className="table-container">
        {promos.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Code</th>
                <th>Pourcentage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((promo) => (
                <tr key={promo.id}>
                  <td>{promo.id}</td>
                  <td>
                    <span className="promo-code">{promo.code}</span>
                  </td>
                  <td>
                    <span className="discount">{promo.pourcentage}%</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => navigate(`/promos/${promo.id}/edit`)}
                        className="btn-action btn-edit"
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(promo.id)}
                        className="btn-action btn-delete"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">
            <p>Aucun code promo disponible</p>
            <button onClick={() => navigate('/promos/new')} className="btn-primary">
              Créer le premier code promo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoList;
