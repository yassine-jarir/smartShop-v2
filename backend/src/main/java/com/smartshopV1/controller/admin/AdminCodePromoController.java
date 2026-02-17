package com.smartshopV1.controller.admin;

import com.smartshopV1.dto.codepromo.CodePromoRequestDTO;
import com.smartshopV1.dto.codepromo.CodePromoResponseDTO;
import com.smartshopV1.security.annotation.RequireAdmin;
import com.smartshopV1.service.CodePromoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/code-promos")
@RequiredArgsConstructor
public class AdminCodePromoController {

    private final CodePromoService codePromoService;

    @RequireAdmin
    @PostMapping
    public ResponseEntity<CodePromoResponseDTO> create(@Valid @RequestBody CodePromoRequestDTO dto) {
        return ResponseEntity.ok(codePromoService.createCodePromo(dto));
    }

    @RequireAdmin
    @GetMapping
    public ResponseEntity<List<CodePromoResponseDTO>> getAll() {
        return ResponseEntity.ok(codePromoService.getAllCodePromos());
    }

    @RequireAdmin
    @GetMapping("/{id}")
    public ResponseEntity<CodePromoResponseDTO> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(codePromoService.getCodePromoById(id));
    }

    @RequireAdmin
    @PutMapping("/{id}")
    public ResponseEntity<CodePromoResponseDTO> update(@PathVariable Long id,
                                                       @Valid @RequestBody CodePromoRequestDTO dto) {
        return ResponseEntity.ok(codePromoService.updateCodePromo(id, dto));
    }

    @GetMapping("/validate/{code}")
    public ResponseEntity<CodePromoResponseDTO> validate(@PathVariable String code) {
        return ResponseEntity.ok(codePromoService.getCodePromoByCode(code));
    }

    @RequireAdmin
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        codePromoService.deleteCodePromo(id);
        return ResponseEntity.noContent().build();
    }
}

