import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientService } from '../../services/clientService';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { LOYALTY_LEVEL_LABELS } from '../../utils/constants';
import { formatAmount } from '../../utils/calculations';
import './ClientList.css';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadClients();
    // eslint-disable-next-line
  }, [page, search]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await clientService.getAll(page, 10, search);
      setClients(response.content || response);
      setTotalPages(response.totalPages || 1);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'ID', field: 'id' },
    { header: 'Nom', field: 'nom' },
    { header: 'Email', field: 'email' },
    {
      header: 'Niveau de fidélité',
      render: (row) => (
        <span className={`badge badge-${row.niveauFidelite?.toLowerCase()}`}>
          {LOYALTY_LEVEL_LABELS[row.niveauFidelite] || row.niveauFidelite}
        </span>
      ),
    },
    {
      header: 'Total commandes',
      field: 'totalOrders',
    },
    {
      header: 'Total dépensé',
      render: (row) => `${formatAmount(row.totalSpent)} DH`,
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="action-buttons">
          <button
            onClick={() => navigate(`/clients/${row.id}`)}
            className="btn-view"
          >
            👁️ Voir
          </button>
          <button
            onClick={() => navigate(`/clients/${row.id}/edit`)}
            className="btn-edit"
          >
            ✏️ Modifier
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="client-list">
      <div className="page-header">
        <h2>👥 Gestion des Clients</h2>
        <button onClick={() => navigate('/clients/new')} className="btn-primary">
          ➕ Nouveau Client
        </button>
      </div>

      <div className="page-content">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(0);
          }}
          placeholder="Rechercher un client..."
        />

        <ErrorMessage message={error} onClose={() => setError('')} />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Table columns={columns} data={clients} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ClientList;
