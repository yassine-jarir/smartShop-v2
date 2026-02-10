package com.smartshopV1.service;

import com.smartshopV1.dto.product.ProductRequestDTO;
import com.smartshopV1.dto.product.ProductResponseDTO;
import java.util.List;
import org.springframework.data.domain.Page;

public interface ProductService {
    ProductResponseDTO createProduct(ProductRequestDTO dto);
    ProductResponseDTO getProductById(Long id);
    List<ProductResponseDTO> getAllProducts();
    List<ProductResponseDTO> getAvailableProducts();
    ProductResponseDTO updateProduct(Long id, ProductRequestDTO dto);
    void deleteProduct(Long id); // soft delete
    void restoreProduct(Long id);
    ProductResponseDTO updateStock(Long id, int quantity);
    Page<ProductResponseDTO> listPaged(int page, int size);
}
