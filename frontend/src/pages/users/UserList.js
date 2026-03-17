import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import './UserList.css';

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await userService.delete(id);
      setUsers(users.filter(u => u.id !== id));
      setError('');
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const getRoleBadge = (role) => {
    return role === 'ADMIN' ? 'badge-admin' : 'badge-client';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="user-list-page">
      <div className="page-header">
        <h1>👥 Gestion des Utilisateurs</h1>
        <button onClick={() => navigate('/users/new')} className="btn-primary">
          ➕ Nouvel Utilisateur
        </button>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      <div className="table-container">
        {users.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom d'utilisateur</th>
                <th>Rôle</th>
                <th>Client ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <strong>{user.username}</strong>
                  </td>
                  <td>
                    <span className={`role-badge ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    {user.clientId ? (
                      <span className="client-link" onClick={() => navigate(`/clients/${user.clientId}`)}>
                        👤 #{user.clientId}
                      </span>
                    ) : (
                      <span className="no-client">-</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => navigate(`/users/${user.id}/edit`)}
                        className="btn-action btn-edit"
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
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
            <p>Aucun utilisateur disponible</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
