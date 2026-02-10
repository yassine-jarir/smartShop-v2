package com.smartshopV1.controller.admin;

import com.smartshopV1.dto.client.ClientRequestDTO;
import com.smartshopV1.dto.client.ClientResponseDTO;
import com.smartshopV1.security.annotation.RequireAdmin;
import com.smartshopV1.service.AdminClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/clients")
@RequiredArgsConstructor
public class AdminClientController {

    private final AdminClientService adminClientService;

    @RequireAdmin
    @PostMapping
    public ResponseEntity<ClientResponseDTO> create(@Valid @RequestBody ClientRequestDTO dto) {
        return ResponseEntity.ok(adminClientService.createClient(dto));
    }

    @RequireAdmin
    @GetMapping
    public ResponseEntity<List<ClientResponseDTO>> list() {
        return ResponseEntity.ok(adminClientService.listClients());
    }

    @RequireAdmin
    @GetMapping("/{id}")
    public ResponseEntity<ClientResponseDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(adminClientService.getClient(id));
    }

    @RequireAdmin
    @PutMapping("/{id}")
    public ResponseEntity<ClientResponseDTO> update(@PathVariable Long id,
                                                     @Valid @RequestBody ClientRequestDTO dto) {
        return ResponseEntity.ok(adminClientService.updateClient(id, dto));
    }

    @RequireAdmin
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        adminClientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}
