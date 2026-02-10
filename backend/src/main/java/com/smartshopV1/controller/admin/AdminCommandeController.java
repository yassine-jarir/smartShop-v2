package com.smartshopV1.controller.admin;
import com.smartshopV1.dto.commande.CommandeRequestDTO;
import com.smartshopV1.dto.commande.CommandeResponseDTO;
import com.smartshopV1.security.annotation.RequireAdmin;
import com.smartshopV1.service.CommandeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/admin/commandes")
@RequiredArgsConstructor
public class AdminCommandeController {

    private final CommandeService commandeService;

    @RequireAdmin
    @PostMapping
    public ResponseEntity<CommandeResponseDTO> create(@Valid @RequestBody CommandeRequestDTO dto) {
        return ResponseEntity.ok(commandeService.createCommande(dto));
    }

    @RequireAdmin
    @GetMapping
    public ResponseEntity<List<CommandeResponseDTO>> list() {
        return ResponseEntity.ok(commandeService.listCommandes());
    }

    @RequireAdmin
    @GetMapping("/{id}")
    public ResponseEntity<CommandeResponseDTO> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(commandeService.getCommande(id));
    }

    @RequireAdmin
    @PostMapping("/{id}/confirm")
    public ResponseEntity<CommandeResponseDTO> confirm(@PathVariable Long id) {
        return ResponseEntity.ok(commandeService.confirmCommande(id));
    }

    @RequireAdmin
    @PostMapping("/{id}/cancel")
    public ResponseEntity<CommandeResponseDTO> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(commandeService.cancelCommande(id));
    }

    @RequireAdmin
    @PostMapping("/{id}/reject")
    public ResponseEntity<CommandeResponseDTO> reject(@PathVariable Long id) {
        return ResponseEntity.ok(commandeService.rejectCommande(id));
    }
}
