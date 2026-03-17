import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { formatAmount } from '../../utils/calculations';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, [page, search]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll(page, 2, search);
      setProducts(response.content || response);
      setTotalPages(response.totalPages || 1);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      await productService.delete(id);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const columns = [
    { header: 'ID', field: 'id' },
    { header: 'Nom', field: 'nom' },
    {
      header: 'Prix HT',
      render: (row) => `${formatAmount(row.prixUnitaire)} DH`,
    },
    { header: 'Stock', field: 'stockDisponible' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="action-buttons">
          <button
            onClick={() => navigate(`/products/${row.id}/edit`)}
            className="btn-edit"
          >
            ✏️ Modifier
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="btn-delete"
          >
            🗑️ Supprimer
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="product-list">
      <div className="page-header">
        <h2>📦 Gestion des Produits</h2>
        <button onClick={() => navigate('/products/new')} className="btn-primary">
          ➕ Nouveau Produit
        </button>
      </div>

      <div className="page-content">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(0);
          }}
          placeholder="Rechercher un produit..."
        />

        <ErrorMessage message={error} onClose={() => setError('')} />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Table columns={columns} data={products} />
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

export default ProductList;
