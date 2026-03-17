import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import './ProductForm.css';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nom: '',
    prixUnitaire: '',
    stockDisponible: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const product = await productService.getById(id);
      setFormData({
        nom: product.nom,
        prixUnitaire: product.prixUnitaire,
        stockDisponible: product.stockDisponible,
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
      // Ensure numbers are properly typed for backend validation
      const productData = {
        nom: formData.nom,
        prixUnitaire: parseFloat(formData.prixUnitaire),
        stockDisponible: parseInt(formData.stockDisponible, 10),
      };
      
      if (isEdit) {
        await productService.update(id, productData);
      } else {
        await productService.create(productData);
      }
      navigate('/products');
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
    <div className="product-form-page">
      <div className="form-container">
        <div className="form-header">
          <h2>{isEdit ? '✏️ Modifier le Produit' : '➕ Nouveau Produit'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <ErrorMessage message={error} onClose={() => setError('')} />

          <div className="form-group">
            <label htmlFor="nom">Nom du produit *</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Ex: Laptop Dell XPS 15"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prixUnitaire">Prix unitaire HT (DH) *</label>
              <input
                type="number"
                id="prixUnitaire"
                name="prixUnitaire"
                value={formData.prixUnitaire}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="form-input"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stockDisponible">Stock disponible *</label>
              <input
                type="number"
                id="stockDisponible"
                name="stockDisponible"
                value={formData.stockDisponible}
                onChange={handleChange}
                required
                min="0"
                className="form-input"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/products')}
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

export default ProductForm;
