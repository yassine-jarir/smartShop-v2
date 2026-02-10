import api from './api';

export const paymentService = {
  getByOrderId: async (orderId) => {
    const response = await api.get(`/admin/commandes/${orderId}/paiements`);
    return response.data;
  },

  create: async (orderId, paymentData) => {
    const response = await api.post(`/admin/commandes/${orderId}/paiements`, paymentData);
    return response.data;
  },
};
