package com.smartshopV1.service.admin;

import com.smartshopV1.dto.product.ProductRequestDTO;
import com.smartshopV1.dto.product.ProductResponseDTO;
import com.smartshopV1.entity.Product;
import com.smartshopV1.mapper.ProductMapper;
import com.smartshopV1.repository.ProductRepository;
import com.smartshopV1.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public ProductResponseDTO createProduct(ProductRequestDTO dto) {
        Product product = productMapper.toEntity(dto);
        Product saved = productRepository.save(product);
        return productMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return productMapper.toResponseDTO(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(productMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAvailableProducts() {
        return productRepository.findAll().stream()
                .filter(p -> !p.isDeleted())
                .map(productMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        productMapper.updateEntity(dto, product);
        Product updated = productRepository.save(product);
        return productMapper.toResponseDTO(updated);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        // Soft delete: mark deleted regardless; if referenced keep flag
        product.setDeleted(true); // boolean property name isDeleted -> setter setDeleted
        productRepository.save(product);
    }

    @Override
    public void restoreProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setDeleted(false);
        productRepository.save(product);
    }

    @Override
    public ProductResponseDTO updateStock(Long id, int quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setStockDisponible(quantity);
        Product saved = productRepository.save(product);
        return productMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> listPaged(int page, int size) {
        PageRequest pr = PageRequest.of(page, size); // limit is size and offset is page . ex : page 0 size 10 => offset 0 limit 10 . offset == page * size .
        Page<Product> productPage = productRepository.findAll(pr);
        List<ProductResponseDTO> dtoList = productPage.getContent().stream()
                .map(productMapper::toResponseDTO)
                .collect(Collectors.toList());
        return new PageImpl<>(dtoList, pr, productPage.getTotalElements());
    }
}

