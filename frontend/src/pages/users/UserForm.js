import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userService } from '../../services/userService';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import './UserForm.css';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'CLIENT',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadUser();
    }
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const user = await userService.getById(id);
      setFormData({
        username: user.username,
        password: '',
        role: user.role,
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
      const userData = { ...formData };
      
      // For updates, remove password if not provided
      if (isEdit && !userData.password) {
        delete userData.password;
      }

      if (isEdit) {
        await userService.update(id, userData);
      } else {
        await userService.create(userData);
      }
      navigate('/users');
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
    <div className="user-form-page">
      <div className="form-container">
        <div className="form-header">
          <h2>{isEdit ? '✏️ Modifier l\'Utilisateur' : '➕ Nouvel Utilisateur'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <ErrorMessage message={error} onClose={() => setError('')} />

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
              placeholder="Ex: johndoe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe {!isEdit && '*'}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEdit}
              minLength="6"
              className="form-input"
              placeholder={isEdit ? "Laisser vide pour ne pas changer" : "Minimum 6 caractères"}
            />
            {isEdit && <small className="form-hint">Laisser vide pour conserver le mot de passe actuel</small>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Rôle *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="CLIENT">Client</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/users')}
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

export default UserForm;
