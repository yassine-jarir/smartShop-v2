import api from './api';

export const promoService = {
  getAll: async () => {
    const response = await api.get('/admin/code-promos');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/admin/code-promos/${id}`);
    return response.data;
  },

  create: async (promoData) => {
    const response = await api.post('/admin/code-promos', promoData);
    return response.data;
  },

  update: async (id, promoData) => {
    const response = await api.put(`/admin/code-promos/${id}`, promoData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/code-promos/${id}`);
    return response.data;
  },

  validate: async (code) => {
    const response = await api.get(`/admin/code-promos/validate/${code}`);
    return response.data;
  },
};
