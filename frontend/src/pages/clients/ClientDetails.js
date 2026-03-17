import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientService } from '../../services/clientService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import { LOYALTY_LEVEL_LABELS, ORDER_STATUS_LABELS } from '../../utils/constants';
import { formatAmount, formatDate } from '../../utils/calculations';
import './ClientDetails.css';

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadClientData();
    // eslint-disable-next-line
  }, [id, page]);

  const loadClientData = async () => {
    try {
      setLoading(true);
      const [clientData, statsData, ordersData] = await Promise.all([
        clientService.getById(id),
        clientService.getStats(id),
        clientService.getOrders(id, page, 10),
      ]);
      setClient(clientData);
      setStats(statsData);
      setOrders(ordersData.content || ordersData);
      setTotalPages(ordersData.totalPages || 1);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const orderColumns = [
    { header: 'ID', field: 'id' },
    {
      header: 'Date',
      render: (row) => formatDate(row.date),
    },
    {
      header: 'Total TTC',
      render: (row) => `${formatAmount(row.totalGlobal)} DH`,
    },
    {
      header: 'Statut',
      render: (row) => (
        <span className={`status-badge status-${row.statut?.toLowerCase()}`}>
          {ORDER_STATUS_LABELS[row.statut] || row.statut}
        </span>
      ),
    },
    {
      header: 'Montant restant',
      render: (row) => `${formatAmount(row.montantRestant)} DH`,
    },
  ];

  if (loading) return <LoadingSpinner />;
  if (error && !client) return <ErrorMessage message={error} />;

  return (
    <div className="client-details">
      <div className="details-header">
        <div>
          <button onClick={() => navigate('/clients')} className="btn-back">
            ← Retour
          </button>
          <h2>👤 Détails du Client</h2>
        </div>
        <button
          onClick={() => navigate(`/clients/${id}/edit`)}
          className="btn-primary"
        >
          ✏️ Modifier
        </button>
      </div>

      <div className="details-content">
        <div className="client-info-card">
          <h3>Informations personnelles</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Nom:</label>
              <span>{client.nom}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{client.email}</span>
            </div>
            <div className="info-item">
              <label>Niveau de fidélité:</label>
              <span className={`badge badge-${client.niveauFidelite?.toLowerCase()}`}>
                {LOYALTY_LEVEL_LABELS[client.niveauFidelite] || client.niveauFidelite}
              </span>
            </div>
          </div>
        </div>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h4>Total commandes</h4>
                <p className="stat-value">{stats.nombreCommandesConfirmees || 0}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h4>Total dépensé</h4>
                <p className="stat-value">{formatAmount(stats.montantTotalDepense)} DH</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h4>Première commande</h4>
                <p className="stat-value">{formatDate(stats.premiereCommande)}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🕒</div>
              <div className="stat-content">
                <h4>Dernière commande</h4>
                <p className="stat-value">{formatDate(stats.derniereCommande)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="orders-section">
          <h3>📋 Historique des commandes</h3>
          <ErrorMessage message={error} onClose={() => setError('')} />
          <Table columns={orderColumns} data={orders} />
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
