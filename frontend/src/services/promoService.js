import api from './api';

export const promoService = {
  validate: async (code) => {
    const response = await api.get(`/admin/code-promos/validate/${code}`);
    return response.data;
  },
};
