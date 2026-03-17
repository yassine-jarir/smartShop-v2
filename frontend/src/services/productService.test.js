import { productService } from './productService';
import api from './api';

jest.mock('./api');

describe('ProductService', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch products with pagination parameters', async () => {
      const mockData = {
        content: [{ id: 1, nom: 'Product 1' }],
        totalPages: 5,
      };
      api.get.mockResolvedValue({ data: mockData });

      const result = await productService.getAll(0, 10, 'test');
      
      expect(api.get).toHaveBeenCalledWith('/admin/products', {
        params: { page: 0, size: 10, search: 'test' },
      });
      expect(result).toEqual(mockData);
    });

    it('should handle search parameter as empty string', async () => {
      api.get.mockResolvedValue({ data: { content: [] } });

      await productService.getAll(1, 20, '');
      
      expect(api.get).toHaveBeenCalledWith('/admin/products', {
        params: { page: 1, size: 20 },
      });
    });
  });

  describe('getById', () => {
    it('should fetch product by id', async () => {
      const mockProduct = { id: 1, nom: 'Product 1', stockDisponible: 50 };
      api.get.mockResolvedValue({ data: mockProduct });

      const result = await productService.getById(1);
      
      expect(api.get).toHaveBeenCalledWith('/admin/products/1');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('create', () => {
    it('should create product with correct data', async () => {
      const productData = {
        nom: 'New Product',
        prixUnitaire: 100,
        stockDisponible: 50,
      };
      const mockResponse = { id: 1, ...productData };
      api.post.mockResolvedValue({ data: mockResponse });

      const result = await productService.create(productData);
      
      expect(api.post).toHaveBeenCalledWith('/admin/products', productData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should update product with correct id and data', async () => {
      const productData = { nom: 'Updated Product', prixUnitaire: 150 };
      const mockResponse = { id: 1, ...productData };
      api.put.mockResolvedValue({ data: mockResponse });

      const result = await productService.update(1, productData);
      
      expect(api.put).toHaveBeenCalledWith('/admin/products/1', productData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('should send delete request with correct id', async () => {
      api.delete.mockResolvedValue({ data: { message: 'Deleted' } });

      await productService.delete(1);
      
      expect(api.delete).toHaveBeenCalledWith('/admin/products/1');
    });
  });

  describe('error handling', () => {
    it('should handle 422 error for insufficient stock', async () => {
      const error = {
        response: {
          status: 422,
          data: { message: 'Stock insuffisant' },
        },
      };
      api.post.mockRejectedValue(error);

      await expect(productService.create({})).rejects.toEqual(error);
    });

    it('should propagate network errors', async () => {
      const error = new Error('Network error');
      api.get.mockRejectedValue(error);

      await expect(productService.getAll()).rejects.toThrow('Network error');
    });
  });
});
