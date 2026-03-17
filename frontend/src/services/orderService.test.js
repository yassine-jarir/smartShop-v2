import { orderService } from './orderService';
import api from './api';

jest.mock('./api');

describe('OrderService', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch orders with all filter parameters', async () => {
      const mockData = {
        content: [{ id: 1, statut: 'PENDING' }],
        totalPages: 3,
      };
      api.get.mockResolvedValue({ data: mockData });

      const result = await orderService.getAll(0, 10, 'PENDING', 5);
      
      expect(api.get).toHaveBeenCalledWith('/admin/commandes', {
        params: { page: 0, size: 10, status: 'PENDING', clientId: 5 },
      });
      expect(result).toEqual(mockData);
    });

    it('should handle optional filter parameters', async () => {
      api.get.mockResolvedValue({ data: { content: [] } });

      await orderService.getAll(1, 20);
      
      expect(api.get).toHaveBeenCalledWith('/admin/commandes', {
        params: { page: 1, size: 20 },
      });
    });
  });

  describe('create', () => {
    it('should create order with items and promo code', async () => {
      const orderData = {
        clientId: 1,
        codePromo: 'PROMO-1234',
        items: [
          { productId: 1, quantite: 2, prixUnitaire: 100 },
          { productId: 2, quantite: 1, prixUnitaire: 50 },
        ],
      };
      const mockResponse = { id: 1, ...orderData, statut: 'PENDING' };
      api.post.mockResolvedValue({ data: mockResponse });

      const result = await orderService.create(orderData);
      
      expect(api.post).toHaveBeenCalledWith('/admin/commandes', orderData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle order creation without promo code', async () => {
      const orderData = {
        clientId: 1,
        codePromo: null,
        items: [{ productId: 1, quantite: 1, prixUnitaire: 100 }],
      };
      api.post.mockResolvedValue({ data: { id: 1, ...orderData } });

      await orderService.create(orderData);
      
      expect(api.post).toHaveBeenCalledWith('/admin/commandes', orderData);
    });

    it('should handle 422 error for stock validation', async () => {
      const error = {
        response: {
          status: 422,
          data: { message: 'Stock insuffisant pour le produit X' },
        },
      };
      api.post.mockRejectedValue(error);

      await expect(orderService.create({})).rejects.toEqual(error);
    });
  });

  describe('confirm', () => {
    it('should confirm order with correct id', async () => {
      const mockResponse = { id: 1, statut: 'CONFIRMED' };
      api.put.mockResolvedValue({ data: mockResponse });

      const result = await orderService.confirm(1);
      
      expect(api.put).toHaveBeenCalledWith('/admin/commandes/1/confirm');
      expect(result).toEqual(mockResponse);
    });

    it('should handle confirmation errors', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Paiement incomplet' },
        },
      };
      api.put.mockRejectedValue(error);

      await expect(orderService.confirm(1)).rejects.toEqual(error);
    });
  });

  describe('cancel', () => {
    it('should cancel order with correct id', async () => {
      const mockResponse = { id: 1, statut: 'CANCELLED' };
      api.put.mockResolvedValue({ data: mockResponse });

      const result = await orderService.cancel(1);
      
      expect(api.put).toHaveBeenCalledWith('/admin/commandes/1/cancel');
      expect(result).toEqual(mockResponse);
    });
  });
});
