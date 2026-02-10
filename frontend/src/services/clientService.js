import api from './api';

export const clientService = {
  getAll: async (page = 0, size = 10, search = '') => {
    const params = { page, size };
    if (search) params.search = search;
    const response = await api.get('/admin/clients', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/admin/clients/${id}`);
    return response.data;
  },

  getStats: async (id) => {
    const response = await api.get(`/admin/clients/${id}/stats`);
    return response.data;
  },

  getOrders: async (id, page = 0, size = 10) => {
    const response = await api.get(`/admin/clients/${id}/orders`, {
      params: { page, size },
    });
    return response.data;
  },

  create: async (clientData) => {
    const response = await api.post('/admin/clients', clientData);
    return response.data;
  },

  update: async (id, clientData) => {
    const response = await api.put(`/admin/clients/${id}`, clientData);
    return response.data;
  },
};
