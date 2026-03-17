import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { PAYMENT_TYPES, ORDER_STATUS } from '../../utils/constants';
import { formatAmount, formatDateTime, roundAmount } from '../../utils/calculations';
import './OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentType, setPaymentType] = useState('');
  const [montant, setMontant] = useState('');
  const [numeroTransaction, setNumeroTransaction] = useState('');
  const [banque, setBanque] = useState('');
  const [dateEcheance, setDateEcheance] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const [orderData, paymentsData] = await Promise.all([
        orderService.getById(id),
        paymentService.getByOrder(id),
      ]);
      setOrder(orderData);
      setPayments(paymentsData);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement de la commande');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    
    const montantNum = parseFloat(montant);
    if (!montantNum || montantNum <= 0) {
      setError('Montant invalide');
      return;
    }

    if (montantNum > order.montantRestant) {
      setError(`Montant trop élevé. Maximum: ${formatAmount(order.montantRestant)} DH`);
      return;
    }

    if (paymentType === 'ESPECES' && montantNum > 20000) {
      setError('Paiement en espèces limité à 20,000 DH');
      return;
    }

    try {
      setSubmitting(true);
      const paymentData = {
        commandeId: parseInt(id),
        typePaiement: paymentType,
        montant: montantNum,
      };

      // Backend expects 'reference' field, not 'numeroTransaction'
      if (paymentType === 'ESPECES') {
        paymentData.reference = numeroTransaction || 'CASH-' + Date.now();
        paymentData.statutPaiement = 'ENCAISSE';
      } else if (paymentType === 'CHEQUE') {
        paymentData.reference = numeroTransaction;
        paymentData.banque = banque;
        paymentData.dateEcheance = dateEcheance;
      } else if (paymentType === 'VIREMENT') {
        paymentData.reference = numeroTransaction;
        paymentData.banque = banque;
      }

      await paymentService.create(paymentData);
      await loadOrder();
      resetPaymentForm();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout du paiement');
    } finally {
      setSubmitting(false);
    }
  };

  const resetPaymentForm = () => {
    setShowPaymentForm(false);
    setPaymentType('');
    setMontant('');
    setNumeroTransaction('');
    setBanque('');
    setDateEcheance('');
  };

  const handleConfirmOrder = async () => {
    if (order.montantRestant > 0) {
      setError('La commande doit être totalement payée avant confirmation');
      return;
    }

    try {
      setSubmitting(true);
      await orderService.confirm(id);
      await loadOrder();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la confirmation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette commande?')) {
      return;
    }

    try {
      setSubmitting(true);
      await orderService.cancel(id);
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'annulation');
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { label: 'En attente', class: 'status-pending' },
      CONFIRMED: { label: 'Confirmée', class: 'status-confirmed' },
      CANCELLED: { label: 'Annulée', class: 'status-cancelled' },
      REJECTED: { label: 'Rejetée', class: 'status-rejected' },
    };
    const config = statusConfig[status] || { label: status, class: '' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return <ErrorMessage message="Commande introuvable" />;

  return (
    <div className="order-details">
      <div className="page-header">
        <div>
          <button onClick={() => navigate('/orders')} className="btn-back">
            ← Retour
          </button>
          <h2>📋 Détails de la commande #{order.id}</h2>
        </div>
        <div className="header-actions">
          {getStatusBadge(order.statut)}
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      <div className="details-grid">
        <div className="details-left">
          <div className="info-card">
            <h3>ℹ️ Informations générales</h3>
            <div className="info-row">
              <span className="label">Client:</span>
              <span className="value">{order.clientNom}</span>
            </div>
            <div className="info-row">
              <span className="label">Date:</span>
              <span className="value">{formatDateTime(order.dateCommande)}</span>
            </div>
            <div className="info-row">
              <span className="label">Code promo:</span>
              <span className="value">{order.codePromo || '-'}</span>
            </div>
          </div>

          <div className="info-card">
            <h3>📦 Produits commandés</h3>
            <div className="products-table">
              <table>
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Prix HT</th>
                    <th>Quantité</th>
                    <th>Total HT</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map(item => (
                    <tr key={item.id}>
                      <td>{item.productNom}</td>
                      <td>{formatAmount(item.prixUnitaire)} DH</td>
                      <td>{item.quantite}</td>
                      <td>{formatAmount(item.prixUnitaire * item.quantite)} DH</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="info-card">
            <h3>💳 Historique des paiements</h3>
            {payments.length > 0 ? (
              <div className="payments-list">
                {payments.map(payment => (
                  <div key={payment.id} className="payment-item">
                    <div className="payment-header">
                      <span className="payment-type">{payment.typePaiement}</span>
                      <span className="payment-amount">{formatAmount(payment.montant)} DH</span>
                    </div>
                    <div className="payment-details">
                      <span className="payment-date">{formatDateTime(payment.datePaiement)}</span>
                      {payment.numeroTransaction && (
                        <span className="payment-ref">Réf: {payment.numeroTransaction}</span>
                      )}
                      {payment.banque && (
                        <span className="payment-bank">🏦 {payment.banque}</span>
                      )}
                      {payment.dateEcheance && (
                        <span className="payment-due">Échéance: {formatDateTime(payment.dateEcheance)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-payments">Aucun paiement enregistré</p>
            )}
          </div>
        </div>

        <div className="details-right">
          <div className="summary-card">
            <h3>💰 Récapitulatif financier</h3>
            <div className="summary-content">
              <div className="summary-line">
                <span>Sous-total HT:</span>
                <span className="amount">{formatAmount(order.montantHT)} DH</span>
              </div>
              <div className="summary-line">
                <span>TVA (20%):</span>
                <span className="amount">{formatAmount(order.montantTVA)} DH</span>
              </div>
              <div className="summary-line total">
                <span>Total TTC:</span>
                <span className="amount">{formatAmount(order.montantTTC)} DH</span>
              </div>
              <div className="summary-line paid">
                <span>Montant payé:</span>
                <span className="amount">{formatAmount(order.montantTTC - order.montantRestant)} DH</span>
              </div>
              <div className={`summary-line remaining ${order.montantRestant === 0 ? 'zero' : ''}`}>
                <span>Montant restant:</span>
                <span className="amount">{formatAmount(order.montantRestant)} DH</span>
              </div>
            </div>
          </div>

          {order.statut === 'PENDING' && (
            <>
              {!showPaymentForm ? (
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="btn-action btn-add-payment"
                >
                  💳 Ajouter un paiement
                </button>
              ) : (
                <div className="payment-form-card">
                  <h3>💳 Nouveau paiement</h3>
                  <form onSubmit={handleAddPayment}>
                    <div className="form-group">
                      <label>Type de paiement *</label>
                      <select
                        value={paymentType}
                        onChange={(e) => setPaymentType(e.target.value)}
                        required
                        className="form-input"
                      >
                        <option value="">Choisir...</option>
                        <option value="ESPECES">Espèces (≤20,000 DH)</option>
                        <option value="CHEQUE">Chèque</option>
                        <option value="VIREMENT">Virement</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Montant *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={montant}
                        onChange={(e) => setMontant(e.target.value)}
                        placeholder="0.00"
                        required
                        className="form-input"
                      />
                    </div>

                    {paymentType === 'ESPECES' && (
                      <div className="form-group">
                        <label>Référence reçu *</label>
                        <input
                          type="text"
                          value={numeroTransaction}
                          onChange={(e) => setNumeroTransaction(e.target.value)}
                          required
                          placeholder="Ex: CASH-001"
                          className="form-input"
                        />
                      </div>
                    )}

                    {(paymentType === 'CHEQUE' || paymentType === 'VIREMENT') && (
                      <>
                        <div className="form-group">
                          <label>Numéro de transaction *</label>
                          <input
                            type="text"
                            value={numeroTransaction}
                            onChange={(e) => setNumeroTransaction(e.target.value)}
                            required
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Banque *</label>
                          <input
                            type="text"
                            value={banque}
                            onChange={(e) => setBanque(e.target.value)}
                            required
                            className="form-input"
                          />
                        </div>

                        {paymentType === 'CHEQUE' && (
                          <div className="form-group">
                            <label>Date d'échéance *</label>
                            <input
                              type="date"
                              value={dateEcheance}
                              onChange={(e) => setDateEcheance(e.target.value)}
                              required
                              className="form-input"
                            />
                          </div>
                        )}
                      </>
                    )}

                    <div className="form-actions">
                      <button
                        type="button"
                        onClick={resetPaymentForm}
                        className="btn-action btn-cancel"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-action btn-submit"
                      >
                        {submitting ? 'Ajout...' : 'Ajouter'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="action-buttons">
                <button
                  onClick={handleConfirmOrder}
                  disabled={submitting || order.montantRestant > 0}
                  className="btn-action btn-confirm"
                  title={order.montantRestant > 0 ? 'Paiement complet requis' : ''}
                >
                  ✅ Confirmer la commande
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={submitting}
                  className="btn-action btn-cancel-order"
                >
                  ❌ Annuler la commande
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
