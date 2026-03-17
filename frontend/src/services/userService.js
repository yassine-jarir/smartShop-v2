import api from './api';

export const userService = {
  getAll: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  create: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
};
