import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { clientService } from '../../services/clientService';
import { productService } from '../../services/productService';
import { promoService } from '../../services/promoService';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { LOYALTY_DISCOUNTS } from '../../utils/constants';
import { calculateOrderTotals, formatAmount, validatePromoCode } from '../../utils/calculations';
import './CreateOrder.css';

const CreateOrder = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [clientsData, productsData] = await Promise.all([
        clientService.getAll(0, 1000),
        productService.getAll(0, 1000),
      ]);
      setClients(clientsData.content || clientsData);
      setProducts(productsData.content || productsData);
    } catch (err) {
      setError('Erreur lors du chargement des données');
    }
  };

  const getClient = () => {
    return clients.find(c => c.id === parseInt(selectedClient));
  };

  const getLoyaltyDiscount = () => {
    const client = getClient();
    return client ? LOYALTY_DISCOUNTS[client.niveauFidelite] || 0 : 0;
  };

  const handleAddProduct = () => {
    if (!selectedProduct || quantity <= 0) return;

    const product = products.find(p => p.id === parseInt(selectedProduct));
    if (!product) return;

    if (quantity > product.stockDisponible) {
      setError(`Stock insuffisant. Disponible: ${product.stockDisponible}`);
      return;
    }

    const existingItem = orderItems.find(item => item.productId === product.id);
    if (existingItem) {
      const newQuantity = existingItem.quantite + quantity;
      if (newQuantity > product.stockDisponible) {
        setError(`Stock insuffisant. Disponible: ${product.stockDisponible}`);
        return;
      }
      setOrderItems(orderItems.map(item =>
        item.productId === product.id
          ? { ...item, quantite: newQuantity }
          : item
      ));
    } else {
      setOrderItems([...orderItems, {
        productId: product.id,
        nom: product.nom,
        prixUnitaire: product.prixUnitaire,
        quantite: quantity,
        stockDisponible: product.stockDisponible,
      }]);
    }

    setSelectedProduct('');
    setQuantity(1);
    setError('');
  };

  const handleRemoveItem = (productId) => {
    setOrderItems(orderItems.filter(item => item.productId !== productId));
  };

  const handleValidatePromo = async () => {
    setPromoError('');
    if (!promoCode) {
      setPromoDiscount(0);
      return;
    }

 
    try {
      const promo = await promoService.validate(promoCode);
      setPromoDiscount(promo.pourcentage || 0);
      setPromoError('');
    } catch (err) {
      setPromoError('Code promo invalide');
      setPromoDiscount(0);
    }
  };

  const calculateTotals = () => {
    return calculateOrderTotals(orderItems, getLoyaltyDiscount(), promoDiscount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient || orderItems.length === 0) {
      setError('Veuillez sélectionner un client et ajouter des produits');
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        clientId: parseInt(selectedClient),
        promoCode: promoCode || null,  // Backend expects 'promoCode', not 'codePromo'
        items: orderItems.map(item => ({
          productId: item.productId,
          quantite: item.quantite,
          // Don't send prixUnitaire - backend calculates it
        })),
      };

      const order = await orderService.create(orderData);
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();
  const client = getClient();

  return (
    <div className="create-order">
      <div className="page-header">
        <div>
          <button onClick={() => navigate('/orders')} className="btn-back">
            ← Retour
          </button>
          <h2>➕ Nouvelle Commande</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-row">
          <div className="order-left">
            <div className="form-card">
              <h3>1️⃣ Sélectionner le client</h3>
              <div className="form-group">
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  required
                  className="form-input"
                >
                  <option value="">Choisir un client...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.nom} - {client.email}
                    </option>
                  ))}
                </select>
              </div>
              {client && (
                <div className="client-badge">
                  <span className={`badge badge-${client.niveauFidelite?.toLowerCase()}`}>
                    {client.niveauFidelite}
                  </span>
                  <span className="discount-info">
                    Remise fidélité: {getLoyaltyDiscount()}%
                  </span>
                </div>
              )}
            </div>

            <div className="form-card">
              <h3>2️⃣ Ajouter des produits</h3>
              <ErrorMessage message={error} onClose={() => setError('')} />
              
              <div className="product-selector">
                <div className="form-group">
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Sélectionner un produit...</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.nom} - {formatAmount(product.prixUnitaire)} DH (Stock: {product.stockDisponible})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="quantity-group">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    min="1"
                    className="form-input quantity-input"
                    placeholder="Qté"
                  />
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    disabled={!selectedProduct}
                    className="btn-add"
                  >
                    ➕ Ajouter
                  </button>
                </div>
              </div>

              {orderItems.length > 0 && (
                <div className="order-items-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Prix HT</th>
                        <th>Quantité</th>
                        <th>Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map(item => (
                        <tr key={item.productId}>
                          <td>{item.nom}</td>
                          <td>{formatAmount(item.prixUnitaire)} DH</td>
                          <td>{item.quantite}</td>
                          <td>{formatAmount(item.prixUnitaire * item.quantite)} DH</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.productId)}
                              className="btn-remove"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="form-card">
              <h3>3️⃣ Code promo (optionnel)</h3>
              <div className="promo-section">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="PROMO-XXXX"
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={handleValidatePromo}
                  className="btn-validate"
                >
                  Valider
                </button>
              </div>
              {promoError && <div className="promo-error">{promoError}</div>}
              {promoDiscount > 0 && (
                <div className="promo-success">
                  ✅ Code promo valide! Remise de {promoDiscount}%
                </div>
              )}
            </div>
          </div>

          <div className="order-right">
            <div className="summary-card">
              <h3>💰 Récapitulatif</h3>
              <div className="summary-content">
                <div className="summary-line">
                  <span>Sous-total HT:</span>
                  <span className="amount">{formatAmount(totals.subtotalHT)} DH</span>
                </div>
                {totals.loyaltyAmount > 0 && (
                  <div className="summary-line discount">
                    <span>Remise fidélité ({getLoyaltyDiscount()}%):</span>
                    <span className="amount">-{formatAmount(totals.loyaltyAmount)} DH</span>
                  </div>
                )}
                {totals.promoAmount > 0 && (
                  <div className="summary-line discount">
                    <span>Remise promo ({promoDiscount}%):</span>
                    <span className="amount">-{formatAmount(totals.promoAmount)} DH</span>
                  </div>
                )}
                <div className="summary-line">
                  <span>HT après remise:</span>
                  <span className="amount">{formatAmount(totals.htAfterDiscount)} DH</span>
                </div>
                <div className="summary-line">
                  <span>TVA (20%):</span>
                  <span className="amount">{formatAmount(totals.tva)} DH</span>
                </div>
                <div className="summary-line total">
                  <span>Total TTC:</span>
                  <span className="amount">{formatAmount(totals.totalTTC)} DH</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !selectedClient || orderItems.length === 0}
                className="btn-submit"
              >
                {loading ? 'Création...' : '✅ Créer la commande'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;
