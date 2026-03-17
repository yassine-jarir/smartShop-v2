import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { clientService } from '../../services/clientService';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../utils/constants';
import { formatAmount, formatDateTime } from '../../utils/calculations';
import './OrderList.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line
  }, [page, statusFilter, clientFilter]);

  const loadClients = async () => {
    try {
      const response = await clientService.getAll(0, 1000);
      setClients(response.content || response);
    } catch (err) {
      console.error('Error loading clients:', err);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAll(page, 10, statusFilter, clientFilter);
      setOrders(response.content || response);
      setTotalPages(response.totalPages || 1);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.nom : `Client #${clientId}`;
  };

  const columns = [
    { header: 'ID', field: 'id' },
    {
      header: 'Client',
      render: (row) => getClientName(row.clientId),
    },
    {
      header: 'Date',
      render: (row) => formatDateTime(row.date),
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
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => navigate(`/orders/${row.id}`)}
          className="btn-view"
        >
          👁️ Voir
        </button>
      ),
    },
  ];

  return (
    <div className="order-list">
      <div className="page-header">
        <h2>📋 Gestion des Commandes</h2>
        <button onClick={() => navigate('/orders/new')} className="btn-primary">
          ➕ Nouvelle Commande
        </button>
      </div>

      <div className="page-content">
        <div className="filters-section">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Rechercher une commande..."
          />
          
          <div className="filters">
            <div className="filter-group">
              <label>Statut:</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                className="filter-select"
              >
                <option value="">Tous</option>
                {Object.keys(ORDER_STATUS).map((status) => (
                  <option key={status} value={status}>
                    {ORDER_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Client:</label>
              <select
                value={clientFilter}
                onChange={(e) => {
                  setClientFilter(e.target.value);
                  setPage(0);
                }}
                className="filter-select"
              >
                <option value="">Tous</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <ErrorMessage message={error} onClose={() => setError('')} />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Table columns={columns} data={orders} />
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

export default OrderList;
