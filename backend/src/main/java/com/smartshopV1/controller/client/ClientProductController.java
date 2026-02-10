package com.smartshopV1.controller.client;

import com.smartshopV1.dto.product.ProductResponseDTO;
import com.smartshopV1.security.annotation.RequireClient;
import com.smartshopV1.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/client/products")
@RequiredArgsConstructor
public class ClientProductController {

    private final ProductService productService;

    @RequireClient
    @GetMapping
    public ResponseEntity<Page<ProductResponseDTO>> list(@RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(productService.listPaged(page, size));
    }

    @RequireClient
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
}

