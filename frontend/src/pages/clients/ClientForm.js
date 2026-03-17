import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clientService } from '../../services/clientService';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { LOYALTY_LEVELS } from '../../utils/constants';
import './ClientForm.css';

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    username: '',
    password: '',
    niveauFidelite: 'BASIC',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadClient();
    }
    // eslint-disable-next-line
  }, [id]);

  const loadClient = async () => {
    try {
      setLoading(true);
      const client = await clientService.getById(id);
      setFormData({
        nom: client.nom,
        email: client.email,
        username: client.username || '',
        password: '', // Don't load password for security
        niveauFidelite: client.niveauFidelite,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      if (isEdit) {
        // For update, only send password if it's not empty
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await clientService.update(id, updateData);
      } else {
        await clientService.create(formData);
      }
      navigate('/clients');
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
    <div className="client-form-page">
      <div className="form-container">
        <div className="form-header">
          <h2>{isEdit ? '✏️ Modifier le Client' : '➕ Nouveau Client'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="client-form">
          <ErrorMessage message={error} onClose={() => setError('')} />

          <div className="form-group">
            <label htmlFor="nom">Nom du client *</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Ex: Jean Dupont"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Ex: jean.dupont@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Ex: jdupont"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEdit}
              className="form-input"
              placeholder={isEdit ? "Laisser vide pour ne pas changer" : "Mot de passe"}
            />
          </div>

          <div className="form-group">
            <label htmlFor="niveauFidelite">Niveau de fidélité *</label>
            <select
              id="niveauFidelite"
              name="niveauFidelite"
              value={formData.niveauFidelite}
              onChange={handleChange}
              required
              className="form-input"
            >
              {Object.keys(LOYALTY_LEVELS).map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/clients')}
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

export default ClientForm;
