import api from './api';

export const orderService = {
  getAll: async (page = 0, size = 10, status = '', clientId = '') => {
    const params = { page, size };
    if (status) params.status = status;
    if (clientId) params.clientId = clientId;
    const response = await api.get('/admin/commandes', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/admin/commandes/${id}`);
    return response.data;
  },

  create: async (orderData) => {
    const response = await api.post('/admin/commandes', orderData);
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.put(`/admin/commandes/${id}/cancel`);
    return response.data;
  },

  confirm: async (id) => {
    const response = await api.put(`/admin/commandes/${id}/confirm`);
    return response.data;
  },
};
