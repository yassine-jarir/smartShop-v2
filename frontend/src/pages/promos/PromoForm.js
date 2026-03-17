import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { promoService } from '../../services/promoService';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import './PromoForm.css';

const PromoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    code: '',
    pourcentage: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadPromo();
    }
  }, [id]);

  const loadPromo = async () => {
    try {
      setLoading(true);
      const promo = await promoService.getById(id);
      setFormData({
        code: promo.code,
        pourcentage: promo.pourcentage,
      });
    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const promoData = {
        code: formData.code,
        pourcentage: parseFloat(formData.pourcentage),
      };

      if (isEdit) {
        await promoService.update(id, promoData);
      } else {
        await promoService.create(promoData);
      }
      navigate('/promos');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading && isEdit) return <LoadingSpinner />;

  return (
    <div className="promo-form-page">
      <div className="form-container">
        <div className="form-header">
          <h2>{isEdit ? '✏️ Modifier le Code Promo' : '➕ Nouveau Code Promo'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="promo-form">
          <ErrorMessage message={error} onClose={() => setError('')} />

          <div className="form-group">
            <label htmlFor="code">Code Promo *</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              pattern="PROMO-[A-Z0-9]{4}"
              className="form-input"
              placeholder="Ex: PROMO-2024"
            />
            <small className="form-hint">Format: PROMO-XXXX (4 caractères alphanumériques majuscules)</small>
          </div>

          <div className="form-group">
            <label htmlFor="pourcentage">Pourcentage de réduction *</label>
            <input
              type="number"
              id="pourcentage"
              name="pourcentage"
              value={formData.pourcentage}
              onChange={handleChange}
              required
              min="0"
              max="100"
              step="0.01"
              className="form-input"
              placeholder="Ex: 15.50"
            />
            <small className="form-hint">Entre 0 et 100%</small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/promos')}
              className="btn-secondary"
            >
              Annuler
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromoForm;
