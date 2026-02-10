package com.smartshopV1.controller.admin;

import com.smartshopV1.dto.paiement.PaiementRequestDTO;
import com.smartshopV1.dto.paiement.PaiementResponseDTO;
import com.smartshopV1.dto.user.UserRequestDTO;
import com.smartshopV1.dto.user.UserResponseDTO;
import com.smartshopV1.security.annotation.RequireAdmin;
import com.smartshopV1.service.AdminUserService;
import com.smartshopV1.service.PaiementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/paiements")
@RequiredArgsConstructor
public class PaiementController {

    private final PaiementService paiementService;

    @PostMapping
    public ResponseEntity<PaiementResponseDTO> createPaiement(@Valid @RequestBody PaiementRequestDTO dto) {
        return ResponseEntity.ok(paiementService.createPaiement(dto));
    }
    @PutMapping("/{id}/encaisser")
    public PaiementResponseDTO encaisserPaiement(
            @PathVariable Long id) {
        return paiementService.encaisserPaiement(id);
    }
//    @RequireAdmin
//    @GetMapping
//    public ResponseEntity<List<UserResponseDTO>> listUsers() {
//        return ResponseEntity.ok(adminUserService.listUsers());
//    }
//
//    @RequireAdmin
//    @GetMapping("/{id}")
//    public ResponseEntity<UserResponseDTO> getUser(@PathVariable Long id) {
//        return ResponseEntity.ok(adminUserService.getUser(id));
//    }
//
//    @RequireAdmin
//    @PutMapping("/{id}")
//    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UserRequestDTO dto) {
//        return ResponseEntity.ok(adminUserService.updateUser(id, dto));
//    }
//
//    @RequireAdmin
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
//        adminUserService.deleteUser(id);
//        return ResponseEntity.noContent().build();
//    }
}
